import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { UserModel } from "../models/user.model";
import { UserInterface } from "../../domain/interface/user.interface";
import { QueryTypes } from 'sequelize';
import { ConnectionService } from '@src/shared/infrastructure/connection.service';
import { UsersGroupsMappingsModel } from "../models/user-group-mapping.model";
import { UserMetadataModel } from "../models/user-metadata.model";
import { BuildNavigationTree } from "@src/shared/utils/navigation.utils";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { SCHEMA_MAP } from '@src/shared/utils/schema-map';

@Injectable()
export class UserRepository implements UserInterface {
    private readonly logger = new AppLogger(UserRepository.name);

    constructor(

        @Inject("UserModel")
        private readonly userModel: typeof UserModel,

        @Inject("UsersGroupsMappingsModel")
        private readonly usersGroupsMappingsModel: typeof UsersGroupsMappingsModel,

        @Inject("UserMetadataModel")
        private readonly userMetadataModel: typeof UserMetadataModel,

        private readonly connectionService: ConnectionService,
        private readonly cacheService: CacheService,

    ) { }


    async findOne(data: { Email: string }) {
        try {
            this.logger.log(`Fetch User Details : ${data}`)

            const { Email } = data

            // Check cache first
            const cacheKey = CACHE_KEYS.USER.BY_EMAIL(Email);
            const cachedUser = await this.cacheService.get(cacheKey);

            if (cachedUser) {
                this.logger.log(`User found in cache for email: ${Email}`);
                return cachedUser;
            }

            this.logger.log(`Cache miss for user, fetching from database for email: ${Email}`);

            const user = await this.userModel.findOne({
                where: { Email },
                attributes: ["Email", "UserId", "UserName", "UserDisplayName", "UserInitails", "RefreshToken"]
            });

            // Cache the result if user exists
            if (user) {
                await this.cacheService.set(
                    cacheKey,
                    user,
                    cacheConfig.ttl.user
                );

                this.logger.log(`User cached for email: ${Email} with TTL: ${cacheConfig.ttl.user} seconds`);
            }

            return user
        } catch (error) {
            this.logger.error(`Error finding User ${error instanceof Error ? error.message : 'Unknown Error'}`)
            throw error
        }
    }

    async findByEmailAndRefresh(RefreshToken: string) {
        try {
            this.logger.log(`Fetch User Details Email: ${RefreshToken}`)

            return await this.userModel.findOne({
                where: { RefreshToken },
                attributes: ["Email", "UserId", "UserName", "UserDisplayName", "UserInitails", "RefreshToken"],
            });

        } catch (error) {
            this.logger.error(`Failed to Fetch user Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            throw error
        }
    }

    async createUsersGroupMapping(UserId: number, GroupId: number = 1) {
        try {
            this.logger.log(`Create UsersGroupMapping UserId: ${UserId}`)
            const userGroupMapping: Partial<UsersGroupsMappingsModel> = {
                UserId: UserId,
                GroupId: GroupId,
                CreatedBy: 1,
                UpdatedBy: 0,
            };

            return await this.usersGroupsMappingsModel.create(userGroupMapping);

        } catch (error) {
            this.logger.log(`UserGroupMapping unable to create Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            throw error
        }
    }

    private async createMappingsFromMetadata(UserId: number, Email: string) {
        this.logger.log(`Fetching UserMetadata for Email: ${Email} to create group mappings`);
        const metadataRows = await this.userMetadataModel.findAll({
            where: { UserEmail: Email },
            attributes: ["GroupId"],
            raw: true,
        });

        if (!metadataRows || metadataRows.length === 0) {
            this.logger.log(`No UserMetadata found for Email: ${Email}. Skipping group mappings.`);
            return;
        }

        await Promise.all(
            metadataRows.map((row) =>
                this.createUsersGroupMapping(UserId, row.GroupId).catch(() => {
                    this.logger.warn(`Failed to create mapping for UserId=${UserId} GroupId=${row.GroupId}`);
                })
            )
        );
    }

    async createOrUpdate(data: any) {
        try {

            this.logger.log(`Data: ${JSON.stringify(data)}`)

            const { Email, RefreshToken } = data

            const user = await this.userModel.findOne({
                where: {
                    Email
                },
            }) as UserModel;

            if (!user) {
                //Save User
                const userDetails = await this.userModel.create({ ...data })

                this.logger.log(`UserDetails: ${JSON.stringify(userDetails)}`)

                if (userDetails) {

                    // Map all groups from UserMetadata for this email
                    await this.createMappingsFromMetadata(userDetails.UserId, Email);
                    return userDetails
                }

            }

            if (RefreshToken) {
                await user.update({ RefreshToken })
            }

            return user

        } catch (error) {
            this.logger.log(`Failed to Create User or Update User: ${error instanceof Error ? error.message : 'Unknown error'}`)
            throw Error
        }
    }

    async refreshUserCache(userId: number): Promise<{ message: string }> {
        try {
            this.logger.log(`Refreshing navigation and rights cache for user id: ${userId}`);

            // Update navigation cache
            const navigationSql = `SELECT * FROM "${SCHEMA_MAP[process.env.NODE_ENV as keyof typeof SCHEMA_MAP]}"."UserNavigation"(:userId)`;
            const navigationResults = await this.connectionService.sequelize!.query(navigationSql, {
                replacements: { userId },
                type: QueryTypes.SELECT,
            });
            const navigationTree = BuildNavigationTree(navigationResults);
            const navigationCacheKey = CACHE_KEYS.USER.NAVIGATION_BY_USER_ID(userId);

            this.logger.log(`User ${userId} , Navigation Tree: ${JSON.stringify(navigationTree)}`);
            await this.cacheService.set(navigationCacheKey, navigationTree, cacheConfig.ttl.user);

            // Update rights cache
            const rightsSql = `SELECT * FROM "${SCHEMA_MAP[process.env.NODE_ENV as keyof typeof SCHEMA_MAP]}"."GetUserRights"(:userId)`;
            const rightsResults: any = await this.connectionService.sequelize!.query(rightsSql, {
                replacements: { userId },
                type: QueryTypes.SELECT,
            });

            let userRights: String[] = [];
            if (rightsResults && rightsResults.length > 0) {
                userRights = rightsResults.map((item: any) => item?.Name);
            }

            const formattedUserRights: { [key: string]: { path: string } } = {};
            if (rightsResults && rightsResults.length > 0) {
                rightsResults.forEach((item: any) => {
                    if (item?.Name) {
                        formattedUserRights[item.Name] = {
                            path: item.Url || '',
                        };
                    }
                });
            }

            const rightsCacheKey = CACHE_KEYS.USER.RIGHTS_BY_USER_ID(userId);
            const formattedRightsCacheKey = CACHE_KEYS.USER.FORMATTED_RIGHTS_BY_USER_ID(userId);

            this.logger.log(`User ${userId} , User Rights: ${JSON.stringify(userRights)}`);
            await this.cacheService.set(rightsCacheKey, userRights, cacheConfig.ttl.user);

            await this.cacheService.set(formattedRightsCacheKey, formattedUserRights, cacheConfig.ttl.user);

            return { message: "Cache refreshed successfully for user id: " + userId };
        } catch (error) {
            this.logger.error(`Failed to refresh navigation and rights cache for user id ${userId}: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw error;
        }
    }

    async navigationDetails(userId: number) {
        try {
            this.logger.log(`Fetching navigation details for user ID: ${userId}`);

            // Check cache first
            const cacheKey = CACHE_KEYS.USER.NAVIGATION_BY_USER_ID(userId);
            const cachedNavigation = await this.cacheService.get(cacheKey);

            if (cachedNavigation) {
                this.logger.log(`Navigation details found in cache for user ID: ${userId}`);
                return cachedNavigation;
            }

            this.logger.log(`Cache miss for navigation details, fetching from database for user ID: ${userId}`);

            // Call the PostgreSQL function
            const sql = `SELECT * FROM "${SCHEMA_MAP[process.env.NODE_ENV as keyof typeof SCHEMA_MAP]}"."UserNavigation"(:userId)`;

            const results = await this.connectionService.sequelize!.query(sql, {
                replacements: {
                    userId,
                },
                type: QueryTypes.SELECT,
            });

            const navigationTree = BuildNavigationTree(results);

            // Cache the result
            await this.cacheService.set(
                cacheKey,
                navigationTree,
                cacheConfig.ttl.user
            );

            this.logger.log(`Navigation details cached for user ID: ${userId} with TTL: ${cacheConfig.ttl.user} seconds`);

            return navigationTree;

        } catch (error) {
            this.logger.error(`Failed to fetch navigation details for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }

    }

    async getUserRights(userId: number): Promise<{ rights: String[], formattedRights: { [key: string]: { path: string } } }> {
        try {
            this.logger.log(`Fetching UserRights details for user ID: ${userId}`);

            // Check cache first
            const cacheKey = CACHE_KEYS.USER.RIGHTS_BY_USER_ID(userId);
            const formattedCacheKey = CACHE_KEYS.USER.FORMATTED_RIGHTS_BY_USER_ID(userId);
            const cachedRights = await this.cacheService.get(cacheKey);
            const cachedFormattedRights = await this.cacheService.get(formattedCacheKey);

            if (cachedRights) {
                this.logger.log(`User rights found in cache for user ID: ${userId}`);
                return { rights: cachedRights as String[], formattedRights: cachedFormattedRights as { [key: string]: { path: string } } };
            }

            this.logger.log(`Cache miss for user rights, fetching from database for user ID: ${userId}`);

            // Call the PostgreSQL function
            const sql = `SELECT * FROM "${SCHEMA_MAP[process.env.NODE_ENV as keyof typeof SCHEMA_MAP]}"."GetUserRights"(:userId)`;

            const results: any = await this.connectionService.sequelize!.query(sql, {
                replacements: {
                    userId,
                },
                type: QueryTypes.SELECT,
            });

            let userRights: String[] = [];
            const formattedUserRights: { [key: string]: { path: string } } = {};

            if (results && results.length > 0) {
                // Existing behaviour: array of right names
                userRights = results.map((item: any) => item?.Name);
                this.logger.log(`User Rights Names: ${userRights}`);

                // New loop: build map like
                // "Ap::VM::Voucher-Entry::Normal::RW": { path: "accounts-payable/..." }
                results.forEach((item: any) => {
                    if (item?.Name) {
                        formattedUserRights[item.Name] = {
                            path: item.Url || '',
                        };
                    }
                });

                this.logger.log(
                    `Formatted User Rights (Name -> { path }): ${JSON.stringify(
                        formattedUserRights,
                    )}`,
                );
            }

            // Cache the result
            await this.cacheService.set(
                cacheKey,
                userRights,
                cacheConfig.ttl.user
            );

            await this.cacheService.set(
                formattedCacheKey,
                formattedUserRights,
                cacheConfig.ttl.user
            );

            this.logger.log(`User rights cached for user ID: ${userId} with TTL: ${cacheConfig.ttl.user} seconds`);

            return { rights: userRights, formattedRights: formattedUserRights };

        } catch (error) {
            this.logger.error(`Failed to fetch User Rights ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }

    }

    async clearUserCache(user: UserModel): Promise<{ message: string }> {
        try {

            this.logger.log(`Clearing user cache for user ID: ${user.UserId}`);

            await this.cacheService.delete(CACHE_KEYS.USER.BY_EMAIL(user.Email));
            await this.cacheService.delete(CACHE_KEYS.USER.NAVIGATION_BY_USER_ID(user.UserId));
            await this.cacheService.delete(CACHE_KEYS.USER.RIGHTS_BY_USER_ID(user.UserId));
            await this.cacheService.delete(CACHE_KEYS.USER.FORMATTED_RIGHTS_BY_USER_ID(user.UserId));

            return { message: "User cache cleared successfully for user ID: " + user.UserId };
        } catch (error) {
            this.logger.error(`Failed to clear user cache for user ID ${user.UserId}: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw error;
        }
    }

}

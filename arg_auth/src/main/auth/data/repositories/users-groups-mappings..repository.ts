

import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { UsersGroupsMappingsModel } from "../models/user-group-mapping.model";
import { GroupModel } from "../models/group.model";
import { UsersGroupsMappings as UsersGroupsMappingsInterface } from "../../domain/interface/users-groups-mappings.interface";

@Injectable()
export class UsersGroupsMappingsRepository implements UsersGroupsMappingsInterface {
    private readonly logger = new AppLogger(UsersGroupsMappingsRepository.name);

    constructor(
        @Inject("UsersGroupsMappingsModel")
        private readonly usersGroupsMappingsModel: typeof UsersGroupsMappingsModel,
    ) { }

    async checkUserGroup(userId: number): Promise<boolean> {
        try {
            this.logger.log(`Checking if user ${userId} has Group 6 assigned`);

            const userGroupMappings = await this.usersGroupsMappingsModel.findAll({
                where: { UserId: userId },
                attributes: ["UserGroupMappingId", "UserId", "GroupId"],
                include: [
                    {
                        model: GroupModel,
                        as: 'group',
                        attributes: ["GroupId", "Name", "Description", "AppId", "Status"]
                    }
                ]
            });

            this.logger.log(`UsersGroups: ${JSON.stringify(userGroupMappings)}`)

            if (!userGroupMappings || userGroupMappings.length === 0) {
                this.logger.log(`No group mapping found for userId: ${userId}`);
                return false;
            }

            const hasGroup6 = userGroupMappings.some(mapping => Number(mapping.GroupId) === 6);
            this.logger.log(`User ${userId} ${hasGroup6 ? 'has' : 'does not have'} Group 6 assigned`);
            
            return hasGroup6;

        } catch (error) {
            this.logger.error(`Error checking user group for userId ${userId}: ${error instanceof Error ? error.message : 'Unknown Error'}`);
            throw error;
        }
    }
}
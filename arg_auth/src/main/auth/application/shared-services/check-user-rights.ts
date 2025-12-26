import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { ConnectionService } from '@src/shared/infrastructure/connection.service';
import { errorResponse } from '@src/shared/utils/response-formatter';
import { ERROR_CONSTANTS } from '@src/shared/constants/error-constants';
import { AppLogger } from '@src/shared/logger/logger.service';
import { SCHEMA_MAP } from '@src/shared/utils/schema-map';
import { UsersGroupsMappings } from '../../domain/interface/users-groups-mappings.interface';

export interface UserRight {
    Route: string;
    Name: string;
    Value: boolean;
}

@Injectable()
export class CheckUserRightsSharedService {
    private readonly logger = new AppLogger(CheckUserRightsSharedService.name);

    constructor(
        
        @Inject("UsersGroupsMappingsInterface")
        private readonly usersGroupsMappings: UsersGroupsMappings,
        private readonly connectionService: ConnectionService,
    ) { }

    async checkUserRights(userId: number, route: string, method: string): Promise<UserRight[]> {
        try {
            // Check if user has Group 6 assigned (only in dev environment)
            if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
                const hasGroup6 = await this.usersGroupsMappings.checkUserGroup(userId);

                if (hasGroup6) {
                    this.logger.log(`User ${userId} has Group 6 assigned - granting access without checking rights`);
                    // Return empty array to indicate success (all rights granted for Group 6)
                    return [];
                }
            }

            // Proceed with normal rights check
            const sql = `SELECT * FROM "${SCHEMA_MAP[process.env.NODE_ENV as keyof typeof SCHEMA_MAP]}"."UserRights"(:route, :method, :userId);`;

            const results = await this.connectionService.sequelize!.query(sql, {
                replacements: {
                    route,
                    method,
                    userId,
                },
                type: QueryTypes.SELECT,
            });

            if (!results || results.length === 0) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
                        {
                            field: 'Access Denied',
                            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
                            message: `You do not have permission to perform this action`,
                        },
                    ]),
                    HttpStatus.UNAUTHORIZED,
                );
            }

            this.logger.log(`Results: ${JSON.stringify(results)}`)

            const hasAtLeastOneTrue = (results as UserRight[]).some(
                (r: UserRight) => r.Value === true
            );

            if (!hasAtLeastOneTrue) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
                        {
                            field: 'Access Denied',
                            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
                            message: 'You do not have permission to perform this action',
                        },
                    ]),
                    HttpStatus.UNAUTHORIZED,
                );
            }

            return results as UserRight[];
        } catch (error) {
            this.logger.error(`Failed to get Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            throw error
        }
    }
}

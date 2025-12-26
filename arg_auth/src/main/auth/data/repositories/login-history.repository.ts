import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { LoginHistoryModel } from "../models/login-histories.model";
import { LoginHistoryInterface } from "../../domain/interface/login-history.interface";

@Injectable()
export class LoginHistoryRepository implements LoginHistoryInterface {
    private readonly logger = new AppLogger(LoginHistoryRepository.name);

    constructor(
        @Inject("LoginHistoryModel")
        private readonly loginHistoryModel: typeof LoginHistoryModel
    ) { }



    async deactivateUserSessions(userId: number): Promise<number> {
        try {
            const [affectedCount] = await this.loginHistoryModel.update(
                {
                    IsActive: false,
                    LoginStatus: false,
                },
                {
                    where: { UserId: userId },   // match by UserId
                },
            );

            return affectedCount; // number of rows updated
        } catch (error) {
            throw error
        }
    }

    async create(data: any): Promise<any> {
        try {
            this.logger.log(`Creating Login History: ${JSON.stringify(data)}`);

            const loginHistory = await this.loginHistoryModel.create({ ...data })

            return loginHistory;
        } catch (error) {
            this.logger.error(`Failed to create login history: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
}

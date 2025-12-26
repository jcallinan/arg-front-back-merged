import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { UserInterface } from "@src/main/auth/domain/interface/user.interface"
import { GenerateTokenSharedService } from "../../shared-services/generate-token";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";

@Injectable()
export class ClearUserCacheUsecase {
    private readonly logger = new AppLogger(ClearUserCacheUsecase.name);

    constructor(

        private readonly generateTokenSharedService: GenerateTokenSharedService,

        @Inject("UserInterface")
        private readonly userInterface: UserInterface

    ) { }

    async execute(accessToken: string): Promise<any> {

        try {
            this.logger.log(`Access Token: ${accessToken}`);

            //decrypt the access token
            const decodedToken = await this.generateTokenSharedService.validateToken(accessToken)

            //find the user by email
            const user = await this.userInterface.findOne({ Email: decodedToken.email })

            if(!user) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
                        {
                            field: "Authentication failed",
                            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
                            message: `User not found`,
                        },
                    ]),
                    HttpStatus.UNAUTHORIZED
                );
            }
            
            //clean the user cache
            await this.userInterface.clearUserCache(user)

            return {
                message: 'User cache cleaned successfully',
            }
        } catch (error) {
            throw error
        }


    }
}

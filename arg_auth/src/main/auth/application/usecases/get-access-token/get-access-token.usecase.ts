import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { MicrosoftAuthSharedService } from "../../shared-services/microsoft-auth";
import { UserInterface } from "@src/main/auth/domain/interface/user.interface"
import { GenerateTokenSharedService } from "../../shared-services/generate-token";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";

@Injectable()
export class GetAccessTokenUsecase {
    private readonly logger = new AppLogger(GetAccessTokenUsecase.name);

    constructor(

        private readonly microsoftAuthSharedService: MicrosoftAuthSharedService,
        private readonly generateTokenSharedService: GenerateTokenSharedService,


        @Inject("UserInterface")
        private readonly userInterface: UserInterface

    ) { }

    async execute(refreshToken: string): Promise<any> {


        try {
            this.logger.log(`Refresh Token: ${refreshToken}`);

            //Find User and getRefresh Token 
            const user = await this.userInterface.findByEmailAndRefresh(refreshToken)

            this.logger.log(`UserDetails ${JSON.stringify(user)}`)

            if (!user) {
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

            // Check in Microsoft AD if its a valid user
            const tokens = await this.microsoftAuthSharedService.getRefreshAndAccessToken(refreshToken, 'refresh_token');

            await this.userInterface.createOrUpdate({Email: user.Email , RefreshToken: tokens.refresh_token})

            const tokenDetails = await this.generateTokenSharedService.generateJwtToken(user.Email, user.UserName)

            return {
                message: 'Issues new token successfully',
                access_token: tokenDetails.token,
                refresh_token: tokens.refresh_token,
                iat: tokenDetails.iat,
                exp: tokenDetails.exp,
            };;
        } catch (error) {
            throw error
        }


    }
}

import {
    Injectable,
    Inject, HttpException, HttpStatus
} from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { MicrosoftAuthSharedService } from "../../shared-services/microsoft-auth";
import { UserInterface } from "@src/main/auth/domain/interface/user.interface";
import { GenerateTokenSharedService } from "../../shared-services/generate-token";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { Request } from 'express';
import { LoginHistoryInterface } from "@src/main/auth/domain/interface/login-history.interface";

@Injectable()
export class MicrosoftAuthUsecase {
    private readonly logger = new AppLogger(MicrosoftAuthUsecase.name);

    constructor(

        private readonly microsoftAuthSharedService: MicrosoftAuthSharedService,
        private readonly generateTokenSharedService: GenerateTokenSharedService,


        @Inject("UserInterface")
        private readonly userInterface: UserInterface,

        @Inject("LoginHistoryInterface")
        private readonly loginHistoryInterface: LoginHistoryInterface

    ) { }

    async execute(req: Request, code: string): Promise<any> {
        try {
            this.logger.log(`Verifying Code using MicroSoft Auth ${code}`);

            const tokens = await this.microsoftAuthSharedService.getRefreshAndAccessToken(code);

            const { access_token, refresh_token } = tokens

            // Fetch User Profile Info
            const userProfileInfo = await this.microsoftAuthSharedService.getUserProfile(access_token);

            const { onPremisesExtensionAttributes } = userProfileInfo

            if (!userProfileInfo || !onPremisesExtensionAttributes?.extensionAttribute1 || !onPremisesExtensionAttributes?.extensionAttribute2) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
                        {
                            field: "authentication failed",
                            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
                            message: `User details are incomplete. Please connect with Admin to provide all required details.`,
                        },
                    ]),
                    HttpStatus.UNAUTHORIZED
                );
            }

            const User = {
                RefreshToken: refresh_token,
                Email: userProfileInfo?.mail,
                UserName: userProfileInfo?.onPremisesExtensionAttributes?.extensionAttribute1 || 'Test',
                UserInitails: userProfileInfo?.onPremisesExtensionAttributes?.extensionAttribute2,
                UserDisplayName: userProfileInfo?.displayName,
                AppId: 10,
            }

            // Save the user or Fetch the User Details
            await this.userInterface.createOrUpdate(User);

            const UserDetails = await this.userInterface.findOne(User);

            // Generate Token
            const tokenDetails = await this.generateTokenSharedService.generateJwtToken(User.Email, User.UserName)

            this.logger.log(`Token: ${tokenDetails.token}`)

            //Login Histories
            const loginDetails = {
                UserId: UserDetails.UserId,
                IPAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                Token: tokenDetails.token,
                RequestHeader: JSON.stringify(req.headers),
                LastRequestMade: new Date(),
                IsActive: true,
                LoginStatus: true
            }

            // Deactivate User Sessions
            await this.loginHistoryInterface.deactivateUserSessions(UserDetails.UserId)

            await this.loginHistoryInterface.create(loginDetails)


            return {
                message: 'User Found',
                access_token: tokenDetails.token,
                refresh_token: refresh_token
            };

        } catch (error) {
            throw error
        }

    }
}

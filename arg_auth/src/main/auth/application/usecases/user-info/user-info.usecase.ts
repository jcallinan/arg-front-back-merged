import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { UserInterface } from "@src/main/auth/domain/interface/user.interface"
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse, simpleResponse, SimpleResponse } from "@src/shared/utils/response-formatter";
import { GenerateTokenSharedService } from "../../shared-services/generate-token";
import { CryptoSharedService } from "../../shared-services/crypto";

type CryptoEncryption = { iv: string, payload: string }

@Injectable()
export class UserInfoUsecase {
    private readonly logger = new AppLogger(UserInfoUsecase.name);

    constructor(

        private readonly generateTokenSharedService: GenerateTokenSharedService,
        private readonly cryptoSharedService: CryptoSharedService,


        @Inject("UserInterface")
        private readonly userInterface: UserInterface
    ) { }

    async execute(accessToken: string): Promise<SimpleResponse<CryptoEncryption>> {
        try {

            this.logger.log(`Decode the old Token ${accessToken}`);

            //Decode the Token
            const decodedToken = await this.generateTokenSharedService.validateToken(accessToken)

            const userDetails = await this.userInterface.findOne({ Email: decodedToken.email })

            this.logger.log(`UserDetails: ${JSON.stringify(userDetails)}`)

            if (!userDetails) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
                        {
                            field: 'Authentication failed',
                            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
                            message: 'Invalid User',
                        },
                    ]),
                    HttpStatus.UNAUTHORIZED,
                );
            }

            // Refresh navigation and rights cache for this user
            await this.userInterface.refreshUserCache(userDetails.UserId);

            // Get Navigation Details
            const NavigationDetails = await this.userInterface.navigationDetails(userDetails.UserId)

            // Get User Rights
            const userRights = await this.userInterface.getUserRights(userDetails.UserId)

            const userDetailsWithNavigation = {
                email: userDetails.Email,
                userDisplayName: userDetails.UserDisplayName,
                userInitials: userDetails.UserInitails,
                UserId: userDetails.UserId,
                navigation: NavigationDetails, 
                rights: userRights.rights,
                rightsv2: userRights.formattedRights
            }

            const encryptedData: CryptoEncryption = this.cryptoSharedService.encrypt(userDetailsWithNavigation)

            this.logger.log(`Encrypted Data: ${encryptedData}`)
            return simpleResponse(encryptedData)

        } catch (error) {
            throw error
        }
    }
}

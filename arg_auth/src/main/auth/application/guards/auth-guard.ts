import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { GenerateTokenSharedService } from '../shared-services/generate-token';
import { AppLogger } from '@src/shared/logger/logger.service';
import { ERROR_CONSTANTS } from '@src/shared/constants/error-constants';
import { errorResponse } from '@src/shared/utils/response-formatter';
import { UserInterface } from '../../domain/interface/user.interface';
import { CheckUserRightsSharedService } from '../shared-services/check-user-rights';
import { AuthDataDto } from '../dto/auth';

@Injectable()
export class AuthGaurd {
  private readonly logger = new AppLogger(AuthGaurd.name);

  constructor(
    private readonly generateTokenSharedService: GenerateTokenSharedService,
    private readonly checkUserRightsSharedService: CheckUserRightsSharedService,


    @Inject('UserInterface')
    private readonly userInterface: UserInterface,
  ) { }

  async getUserFromRequest(req: any, authData: AuthDataDto) {
    this.logger.log('Extracting user from request...');

    const auth = req.headers['authorization'] || req.headers['Authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: 'Authentication failed',
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: 'Token not found',
          },
        ]),
        HttpStatus.NOT_FOUND,
      );
    }

    const token = auth.split(' ')[1];

    // Validate token
    // const resp = await this.generateTokenSharedService.validateToken(token);
    const resp = await this.generateTokenSharedService.validateToken(token);
    if (!resp) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
          {
            field: 'Authentication failed',
            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
            message: 'Invalid token',
          },
        ]),
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.logger.log(`Decoded Token: ${JSON.stringify(resp)}`);

    // Fetch user details
    const userDetails = await this.userInterface.findOne({ Email: resp?.email });
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

    const { restApi } = authData
    if (restApi) {

      const { route, method } = authData

      if (!route || !method) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
            {
              field: 'Authentication failed',
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: 'Route and Method required',
            },
          ]),
          HttpStatus.UNAUTHORIZED,
        );
      }

      this.logger.log(`Path: ${authData.route}`)

      // Authorization
      await this.checkUserRightsSharedService.checkUserRights(userDetails.UserId, route, method.toUpperCase())
    }

    this.logger.log(`UserID: ${userDetails.UserId}`);

    return {
      email: userDetails.Email,
      userId: userDetails.UserId,
      userName: userDetails.UserName,
      userDisplayName: userDetails.UserDisplayName,
      userInitials: userDetails.UserInitails,
    }

  }
}

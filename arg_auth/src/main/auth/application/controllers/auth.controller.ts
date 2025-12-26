import { Controller, Get, Query, Res, Req, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { MicrosoftAuthUsecase } from '../usecases/ms-auth/microsoft-auth.usecase';
import { MsCallbackDto, ValidateUserDto } from '../dto/auth';
import { ApiTags } from '@nestjs/swagger';
import * as SwaggerConfig from "@src/api-schema/auth.swagger";
import { Response, Request, CookieOptions } from 'express';
import { GetAccessTokenUsecase } from '../usecases/get-access-token/get-access-token.usecase';
import { ApiEndpoint } from '@src/api-schema/swagger.decorator';
import { AuthGaurd } from '../guards/auth-guard';
import { errorResponse } from '@src/shared/utils/response-formatter';
import { UserInfoUsecase } from '../usecases/user-info/user-info.usecase';
import { ERROR_CONSTANTS } from '@src/shared/constants/error-constants';
import { ClearUserCacheUsecase } from '../usecases/clear-user-cache/clear-user-cache.usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly microsoftAuthUsecase: MicrosoftAuthUsecase,
        private readonly getAccessTokenUsecase: GetAccessTokenUsecase,
        private readonly authGuard: AuthGaurd, // inject guard
        private readonly userInfoUsecase: UserInfoUsecase,
        private readonly clearUserCacheUsecase: ClearUserCacheUsecase,

    ) { }

    private clearAllCookies(res: Response) {
        const isLocal = process.env.SITE_ENV === "local";

        // Common base options
        const baseOptions: CookieOptions = {
            httpOnly: true,
            secure: !isLocal,
            sameSite: (isLocal ? "strict" : "none") as CookieOptions["sameSite"],
        };

        // Add domain only for non-local environments
        if (!isLocal) {
            baseOptions.domain = ".amref.com";
        }

        res.clearCookie("access-token", {
            ...baseOptions,
            path: "/",
        });

        res.clearCookie("rf", {
            ...baseOptions,
            path: "/v1/auth/token",
        });

        console.log('Response cookies header:', res.getHeaders()['set-cookie']);
    }

    private setAuthCookie(res: Response, access_token: string, refresh_token: string) {
        const isLocal = process.env.SITE_ENV === "local";

        // Common cookie options
        const baseOptions: CookieOptions = {
            httpOnly: true,
            secure: !isLocal,
        };

        // Access token options
        const accessTokenOptions: CookieOptions = {
            ...baseOptions,
            path: "/",
            sameSite: (isLocal ? "strict" : "none") as CookieOptions["sameSite"],
            domain: isLocal ? undefined : ".amref.com",
            maxAge: 30 * 60 * 1000, // 30 mins
        };

        // Refresh token options
        const refreshTokenOptions: CookieOptions = {
            ...baseOptions,
            path: "/",
            sameSite: (isLocal ? "strict" : "none") as CookieOptions["sameSite"],
            domain: isLocal ? undefined : ".amref.com",
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        // Set cookies
        res.cookie("access-token", access_token, accessTokenOptions);
        res.cookie("rf", refresh_token, refreshTokenOptions);

        console.log('Response cookies header:', res.getHeaders()['set-cookie']);
    }

    @Get('me')
    @ApiEndpoint(SwaggerConfig.getUserDetails)
    async getUserDetails(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        try {
            const accessToken = req.cookies['access-token'];

            if (!accessToken) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
                        {
                            field: "Authentication failed",
                            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
                            message: `Access Token not found`,
                        },
                    ]),
                    HttpStatus.UNAUTHORIZED
                );
            }

            const userDetails = await this.userInfoUsecase.execute(accessToken);
            res.json(userDetails);
            return;
        } catch (error) {
            throw error;
        }
    }

    @Get('/logout')
    @ApiEndpoint(SwaggerConfig.getLogout)
    async getLogout(@Req() req: Request ,@Res() res: Response): Promise<Response> {
        try {
            // Regardless of whether cookies exist or not, just clear them
            const access_token = req.cookies['access-token'];

            if(access_token) {
                await this.clearUserCacheUsecase.execute(access_token);
            }

            this.clearAllCookies(res);

            // Send JSON success response
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Successfully cleared cookies, cache and logged out',
            });
        } catch (error) {
            this.clearAllCookies(res);
            console.log(`Error: ${error instanceof Error ? error.message : 'Unknown Error'}`);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Something went wrong while logging out',
            });
        }
    }

    // Initiate Microsoft SSO login
    @Get('callback')
    @ApiEndpoint(SwaggerConfig.AuthCallback)
    async callback(@Query() dto: MsCallbackDto, @Req() req: Request, @Res() res: Response,) {
        try {
            const token = await this.microsoftAuthUsecase.execute(req, dto.code);

            this.setAuthCookie(res, token.access_token, token.refresh_token);

            return res.redirect(process.env.DASHBOARD_URL!);

        } catch (error) {
            this.clearAllCookies(res)
            return res.redirect(process.env.LOGIN_URL!);
        }
    }


    @Get('token')
    @ApiEndpoint(SwaggerConfig.getToken)
    async getToken(@Req() req: Request, @Res() res: Response) {

        console.log(req.cookies, 'COOKIES')

        const refreshToken = req.cookies['rf'];

        try {
            const response = await this.getAccessTokenUsecase.execute(refreshToken);
            this.setAuthCookie(res, response.access_token, response.refresh_token);

            // Send proper JSON response
            return res.json({
                success: true,
                iat: response.iat,
                exp: response.exp,
            });

        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearAllCookies(res)
            throw error
        }
    }


    @Post()
    @ApiEndpoint(SwaggerConfig.validateUser)
    async UserGuard(@Req() req: Request, @Body() body: ValidateUserDto) {
        try {
            const { authData } = body
            const result = await this.authGuard.getUserFromRequest(req, authData)
            return result

        } catch (error) {
            throw error
        }
    }

}

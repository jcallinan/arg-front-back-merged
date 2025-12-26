import {  Injectable } from '@nestjs/common';
import { AppLogger } from '@src/shared/logger/logger.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenSharedService {

    constructor(
        private readonly jwtService: JwtService,

    ) { }
    private readonly logger = new AppLogger(GenerateTokenSharedService.name)


    async generateJwtToken(email: string, extensionAttribute1: string) {
        try {

            this.logger.log(`Generating JWT token for user ${email}`)

            const payload = { email, extensionAttribute1 };
            const token = this.jwtService.sign(payload);

            const decoded = this.jwtService.decode(token) as { iat?: number; exp?: number } | null;

            return {
                token,
                iat: decoded?.iat,
                exp: decoded?.exp,
            };

        } catch (error) {
            this.logger.log(`Failed to Create Token for email:${email} ${error instanceof Error ? error.message : "Unknown error"}`)
            throw error
        }
    }

    async validateTokenWithExpiration(oldToken: string) {
        try {
            return await this.jwtService.verify(oldToken, { ignoreExpiration: true });

        } catch (error) {
            this.logger.error(`Unable to validate token  ${error instanceof Error ? error.message : "Unknown error"}`)
            throw error
        }
    }

    async validateToken(oldToken: string) {
        try {

            this.logger.log(`Token: ${oldToken}`);
            const payload = await this.jwtService.verifyAsync(oldToken);
            return payload;

        } catch (error: unknown) {
            this.logger.error(
                `Unable to validate token: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
            throw error;
        }
    }


}

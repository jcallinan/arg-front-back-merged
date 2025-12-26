import { Injectable } from '@nestjs/common';
import { AppLogger } from '@src/shared/logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios'
import { inspect } from 'util';

@Injectable()
export class MicrosoftAuthSharedService {

    constructor(private readonly jwtService: JwtService) { }
    private readonly logger = new AppLogger(MicrosoftAuthSharedService.name)

    private tokenUrl = `${process.env.MS_TOKEN_URL ?? "https://login.microsoftonline.com/"}${process.env.MS_TENANT_ID ?? "5b6d8034-b358-4dfa-bdf0-2bff2b76ff39"}/oauth2/v2.0/token`;
    private graphUrl = "https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,jobTitle,onPremisesExtensionAttributes";



    async getUserProfile(access_token: string) {
        this.logger.log('Starting to fetch user profile from Microsoft Graph API');

        try {
            this.logger.debug(`Making request to Microsoft Graph API GraphUrl: ${this.graphUrl}`);

            const profileResponse = await axios.get(this.graphUrl, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            // ✅ Safe logging
            this.logger.log(`ProfileResponse: ${JSON.stringify(profileResponse.data)}`);

            return profileResponse.data; // return only the payload, not the full response
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                this.logger.error(`Axios error message: ${error.message}`);

                if (error.response) {
                    this.logger.error(`Response status: ${error.response.status}`);
                    try {
                        this.logger.error(
                            `Response data: ${JSON.stringify(error.response.data)}`
                        );
                    } catch {
                        this.logger.error(
                            `Response data (inspect): ${inspect(error.response.data, {
                                depth: 2,
                            })}`
                        );
                    }
                } else if (error.request) {
                    this.logger.error(
                        `No response received. Request (inspect): ${inspect(error.request, {
                            depth: 1,
                        })}`
                    );
                }
            } else {
                // Fallback for non-Axios errors
                this.logger.error(
                    `Unexpected error: ${inspect(error, { depth: 2 })}`
                );
            }

            throw error;
        }
    }


    async getRefreshAndAccessToken(code: string, grant_type: string = 'authorization_code') {

        try {
            // Step 1: Exchange code for tokens
            this.logger.debug(`Preparing OAuth token exchange parameters, Code: ${code}`);

            const params = new URLSearchParams();
            params.append('client_id', process.env.MS_CLIENT_ID || "2e1d21e3-53d4-4f94-ad97-10a35acf6192");
            params.append('client_secret', process.env.MS_CLIENT_SECRET || "qLM8Q~ie9eSPT335Ta2Xy8051j7yHMWzEYXTCcPZ");

            params.append('redirect_uri', process.env.MS_REDIRECT_UI || "http://localhost:8000/v1/auth/callback");
            params.append('grant_type', `${grant_type}`);
            params.append('scope', 'openid profile email offline_access User.Read');

            if (grant_type === 'authorization_code') {
                params.append('code', code);
            } else {
                params.append('refresh_token', code);
            }

            this.logger.log(`${params}: PARAMS`)

            const tokenResponse = await axios.post(
                this.tokenUrl, params,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
            );


            this.logger.log(`tokenResponse: ${JSON.stringify(tokenResponse.data)}`)

            const { access_token, refresh_token, id_token } = tokenResponse.data;

            return { access_token, refresh_token, id_token };

        } catch (error) {
            const err = error as any; // cast inside, not in the catch signature

            if (axios.isAxiosError(err)) {
                this.logger.error(`Axios error message: ${err.message}`);

                if (err.response) {
                    // Log status and body — safe to stringify
                    this.logger.error(`Response status: ${err.response.status}`);
                    try {
                        this.logger.error(`Response data: ${JSON.stringify(err.response.data)}`);
                    } catch (e) {
                        // Fallback if response.data somehow is circular
                        this.logger.error(`Response data (inspect): ${inspect(err.response.data, { depth: 2 })}`);
                    }
                } else if (err.request) {
                    // Request made but no response
                    this.logger.error(`No response received. Request (inspect): ${inspect(err.request, { depth: 1 })}`);
                }
            } else {
                // Generic error: use inspect to avoid circular errors
                this.logger.error(`Full error (inspect): ${inspect(err, { depth: 2 })}`);
            }

            // rethrow or return a controlled error
            throw err;
        }
    }

    async generateJwtToken(email: string, extensionAttribute1: string) {
        try {

            const payload = { email, extensionAttribute1 };
            return this.jwtService.sign(payload);

        } catch (error) {
            throw error
        }
    }

}


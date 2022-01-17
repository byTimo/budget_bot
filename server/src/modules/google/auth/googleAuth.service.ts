import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { google } from "googleapis";
import { FilesService } from "../../files/files.service";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const REDIRECT_URL = "urn:ietf:wg:oauth:2.0:oob";

@Injectable()
export class GoogleAuthService {
    private readonly auth: OAuth2Client;

    constructor(
        private readonly config: ConfigService,
        private readonly files: FilesService,
        private readonly logger: Logger
    ) {
        this.auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret);
        this.tryAuthorizeBySavedToken();
    }

    async tryAuthorizeBySavedToken(): Promise<void> {
        if (!this.config.googleAuthTokenPath) {
            this.logger.warn(`There isn't path to google auth token`);
            return;
        }

        const result = await this.files.read(this.config.googleAuthTokenPath, "utf8");
        if (result.success) {
            const credentials: Credentials = JSON.parse(result.data);
            this.auth.setCredentials(credentials);
        }
    }

    public generateAuthUrl(): string {
        return this.auth.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
            redirect_uri: REDIRECT_URL,
        });
    }

    public async restoreToken(code: string): Promise<void> {
        const response = await this.auth.getToken({
            code,
            client_id: this.config.googleClientId,
            redirect_uri: REDIRECT_URL,
        });
        this.auth.setCredentials(response.tokens);

        if (!this.config.googleAuthTokenPath) {
            this.logger.warn(`There isn't path to google auth token`);
            return;
        }

        const data = JSON.stringify(response.tokens);
        await this.files.write(this.config.googleAuthTokenPath, data, "utf8");
    }

    public getStatus(): string {
        return "access_token" in this.auth.credentials ? "authorized" : "unauthorized";
    }
}

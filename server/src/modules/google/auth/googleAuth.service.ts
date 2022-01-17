import { Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const REDIRECT_URL = "urn:ietf:wg:oauth:2.0:oob";

@Injectable()
export class GoogleAuthService {
    private readonly auth: OAuth2Client;

    constructor(private readonly config: ConfigService) {
        this.auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret);
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
    }

    public q() {
        return this.auth.credentials;
    }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { google, sheets_v4 } from "googleapis";
import type { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import Sheets = sheets_v4.Sheets;

@Injectable()
export class SheetsService {
    private readonly auth: OAuth2Client;
    private readonly sheets: Sheets;

    constructor(private readonly config: ConfigService) {
        this.auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret);
        this.sheets = google.sheets({ version: "v4", auth: this.auth });
    }

    public async readTestData(): Promise<any> {
        return this.sheets.spreadsheets.values.get({
            spreadsheetId: this.config.googleSheetsId,
            range: "Комуналка!A1:C8"
        })
    }
}

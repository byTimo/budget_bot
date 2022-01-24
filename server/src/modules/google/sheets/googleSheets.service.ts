import { Injectable, Logger } from "@nestjs/common";
import { google, sheets_v4 } from "googleapis";
import { GoogleAuthService } from "../auth/googleAuth.service";
import { InternalType, ValueRange } from "./googleSheets.contracts";
import { ConfigService } from "../../config/config.service";
import Sheets = sheets_v4.Sheets;

const internalSheet = "Internal!";

const internalTypeToRange: Record<InternalType, string> = {
    categories: `${internalSheet}A:A`
};

@Injectable()
export class GoogleSheetsService {
    private readonly sheets: Sheets;

    constructor(
        private readonly config: ConfigService,
        private readonly auth: GoogleAuthService,
        private readonly logger: Logger
    ) {
        this.sheets = google.sheets({ version: "v4", auth: this.auth.auth });
    }

    public async selectInternal(type: InternalType): Promise<string[]> {
        const range = internalTypeToRange[type];

        this.logger.log(`[GOOGLE] read values by ${range}`);
        //TODO (byTimo) catch errors
        const result = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.config.googleSheetsId,
            range,
            majorDimension: "COLUMNS"
        });

        if (!result.data.values || result.data.values.length === 0) {
            throw new Error("Bad data");
        }

        const title = result.data.values[0][0];
        if (title !== type) {
            throw new Error("Bad data");
        }

        return result.data.values[0].slice(1);
    }

    public async write(valueRange: ValueRange): Promise<any> {
        this.logger.log(`[GOOGLE] append data by ${valueRange.range}`);

        //TODO (byTimo) Error if loose
        const result = await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.config.googleSheetsId,
            range: valueRange.range,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: valueRange,
        });
    }
}

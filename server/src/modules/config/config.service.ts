import { Injectable } from "@nestjs/common";
import { ConfigService as DefaultConfigService } from "@nestjs/config";

const TOKEN = "TELEGRAM_TOKEN";
const GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";
const GOOGLE_SHEETS_ID = "GOOGLE_SHEETS_ID";

@Injectable()
export class ConfigService {
    constructor(private configService: DefaultConfigService) {
    }

    public get telegramToken(): string {
        return this.getOrThrow<string>(TOKEN);
    }

    public get googleClientId(): string {
        return this.getOrThrow(GOOGLE_CLIENT_ID);
    }

    public get googleClientSecret(): string {
        return this.getOrThrow(GOOGLE_CLIENT_SECRET);
    }

    public get googleSheetsId(): string {
        return this.getOrThrow(GOOGLE_SHEETS_ID);
    }

    private getOrThrow<T>(path: string): T {
        const value = this.configService.get<T>(path);
        if (value) {
            return value;
        }

        throw new Error(`Can't find ${path} in config`);
    }
}

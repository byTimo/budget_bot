import { Injectable } from "@nestjs/common";
import { ConfigService as DefaultConfigService } from "@nestjs/config";

const SERVER_PORT = "SERVER_PORT";
const TELEGRAM_HOOK_PORT = "TELEGRAM_HOOK_PORT";
const TELEGRAM_TOKEN = "TELEGRAM_TOKEN";
const GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";
const GOOGLE_SHEETS_ID = "GOOGLE_SHEETS_ID";
const GOOGLE_AUTH_TOKEN_PATH = "GOOGLE_AUTH_TOKEN_PATH";

@Injectable()
export class ConfigService {
    constructor(private configService: DefaultConfigService) {
    }

    public get port(): number {
        return this.getOrDefault<number>(SERVER_PORT, 3000);
    }

    public get telegramWebhookPort(): number {
        return this.getOrDefault<number>(TELEGRAM_HOOK_PORT, 3001);
    }

    public get telegramToken(): string {
        return this.getOrThrow<string>(TELEGRAM_TOKEN);
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

    public get googleAuthTokenPath(): string | undefined {
        return this.configService.get<string>(GOOGLE_AUTH_TOKEN_PATH);
    }

    private getOrThrow<T>(path: string): T {
        const value = this.configService.get<T>(path);
        if (value) {
            return value;
        }

        throw new Error(`Can't find ${path} in config`);
    }

    private getOrDefault<T>(path: string, defaultValue: T): T {
        return this.configService.get<T>(path) ?? defaultValue;
    }
}

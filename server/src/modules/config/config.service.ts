import { Injectable } from "@nestjs/common";
import { ConfigService as DefaultConfigService } from "@nestjs/config";

const TELEGRAM_TOKEN = "TELEGRAM_TOKEN";
const TELEGRAM_WEBHOOK_DOMAIN = "TELEGRAM_WEBHOOK_DOMAIN";
const TELEGRAM_WEBHOOK_HOST = "TELEGRAM_WEBHOOK_HOST";
const TELEGRAM_WEBHOOK_PORT = "TELEGRAM_WEBHOOK_PORT";
const GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";
const GOOGLE_SHEETS_ID = "GOOGLE_SHEETS_ID";
const GOOGLE_AUTH_TOKEN_PATH = "GOOGLE_AUTH_TOKEN_PATH";

@Injectable()
export class ConfigService {
    constructor(private configService: DefaultConfigService) {
    }

    public get telegramToken(): string {
        return this.getOrThrow<string>(TELEGRAM_TOKEN);
    }

    public get telegramWebhookDomain(): string | undefined {
        return this.configService.get<string>(TELEGRAM_WEBHOOK_DOMAIN);
    }

    public get telegramWebhookHost(): string | undefined {
        return this.configService.get<string>(TELEGRAM_WEBHOOK_HOST);
    }

    public get telegramWebhookPort(): number | undefined {
        return this.configService.get<number>(TELEGRAM_WEBHOOK_PORT);
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
}

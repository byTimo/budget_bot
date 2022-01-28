import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { session, Telegraf } from "telegraf";
import { TelegrafModule } from "nestjs-telegraf";
import { SettingsScene } from "./scenes/SettingsScene";
import { TelegramUpdate } from "./telegram.update";
import { StatusScene } from "./scenes/StatusScene";
import { GoogleAuthModule } from "../google/auth/googleAuth.module";
import { GoogleAuthScene } from "./scenes/GoogleAuthScene";
import { LoggerModule } from "../logger/logger.module";
import { telegrafLogger } from "./middlewares/logger.middleware";
import { ExpensesWizard } from "./wizards/ExpensesWizard";
import { CategoriesModule } from "../categories/categories.module";
import { TransactionsModule } from "../transactions/transactions.module";
import { TemplatesModule } from "../templates/templates.module";
import { DatesModule } from "../dates/dates.module";

const scenes = [
    SettingsScene,
    StatusScene,
    GoogleAuthScene,
];

const wizards = [
    ExpensesWizard,
];

function buildWebhookOptions(config: ConfigService): Telegraf.LaunchOptions["webhook"] {
    const domain = config.telegramWebhookDomain;
    const host = config.telegramWebhookHost;
    const port = config.telegramWebhookPort;

    if(domain && host && port) {
        return {
            host,
            port,
            domain,
        }
    }

    return undefined;
}

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule, LoggerModule],
            inject: [ConfigService, Logger],
            useFactory: (config: ConfigService, logger: Logger) => {
                const webhook = buildWebhookOptions(config);
                if(webhook) {
                    logger.log("Telegram webhook was configured");
                }
                return {
                    token: config.telegramToken,
                    middlewares: [session(), telegrafLogger(logger)],
                    launchOptions: {
                        webhook,
                    }
                }
            }
        }),
        GoogleAuthModule,
        LoggerModule,
        CategoriesModule,
        DatesModule,
        TransactionsModule,
        TemplatesModule,
    ],
    providers: [
        TelegramUpdate,
        ...scenes,
        ...wizards,
    ]
})
export class TelegramModule {}

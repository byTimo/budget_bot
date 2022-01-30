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
import { TunnelModule } from "../tunnel/tunnel.module";
import { TunnelService } from "../tunnel/tunnel.service";

const scenes = [
    SettingsScene,
    StatusScene,
    GoogleAuthScene,
];

const wizards = [
    ExpensesWizard,
];

function buildWebhookOptions(config: ConfigService, domain: string): Telegraf.LaunchOptions["webhook"] {
    return {
        domain,
        hookPath: "/tg_hook",
        port: config.telegramWebhookPort,
    };
}

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule, LoggerModule, TunnelModule],
            inject: [ConfigService, Logger, TunnelService],
            useFactory: async (config: ConfigService, logger: Logger, tunnel: TunnelService) => {
                const domain = await tunnel.getPublic();
                const webhook = buildWebhookOptions(config, domain);
                if (webhook) {
                    logger.log(`The telegram webhook was configured at ${webhook.domain}`);
                }
                return {
                    token: config.telegramToken,
                    middlewares: [session(), telegrafLogger(logger)],
                    launchOptions: {
                        webhook,
                    }
                };
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

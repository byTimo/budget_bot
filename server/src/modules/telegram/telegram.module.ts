import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { session } from "telegraf";
import { TelegrafModule } from "nestjs-telegraf";
import { SettingsScene } from "./scenes/SettingsScene";
import { TelegramUpdate } from "./telegram.update";
import { StatusScene } from "./scenes/StatusScene";
import { GoogleAuthModule } from "../google/auth/googleAuth.module";
import { GoogleAuthScene } from "./scenes/GoogleAuthScene";
import { LoggerModule } from "../logger/logger.module";
import { telegrafLogger } from "./middlewares/logger.middleware";
import { ExpensesWizard } from "./wizards/ExpensesWizard";

const scenes = [
    SettingsScene,
    StatusScene,
    GoogleAuthScene,
];

const wizards = [
    ExpensesWizard,
];

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule, LoggerModule],
            inject: [ConfigService, Logger],
            useFactory: (config: ConfigService, logger: Logger) => ({
                token: config.telegramToken,
                middlewares: [session(), telegrafLogger(logger)],
            })
        }),
        GoogleAuthModule,
        LoggerModule,
    ],
    providers: [
        TelegramUpdate,
        ...scenes,
        ...wizards,
    ]
})
export class TelegramModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { session } from "telegraf";
import { TelegrafModule } from "nestjs-telegraf";
import { MainScene } from "./scenes/MainScene";
import { TelegramUpdate } from "./telegram.update";
import { StatusScene } from "./scenes/StatusScene";
import { GoogleAuthModule } from "../google/auth/googleAuth.module";
import { GoogleAuthScene } from "./scenes/GoogleAuthScene";

const scenes = [
    MainScene,
    StatusScene,
    GoogleAuthScene,
];

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                token: config.telegramToken,
                middlewares: [session()],
            })
        }),
        GoogleAuthModule,
    ],
    providers: [
        TelegramUpdate,
        ...scenes,
    ]
})
export class TelegramModule {}

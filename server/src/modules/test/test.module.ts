import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { TestUpdate } from "./test.update";

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                token: config.token,
            })
        })
    ],
    providers: [TestUpdate],
})
export class TestModule {}

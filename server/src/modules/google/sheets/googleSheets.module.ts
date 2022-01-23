import { Module } from "@nestjs/common";
import { GoogleAuthModule } from "../auth/googleAuth.module";
import { LoggerModule } from "../../logger/logger.module";
import { GoogleSheetsService } from "./googleSheets.service";
import { ConfigModule } from "../../config/config.module";

@Module({
    imports: [ConfigModule, GoogleAuthModule, LoggerModule],
    providers: [GoogleSheetsService],
    exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {
}

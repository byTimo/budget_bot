import { Module } from "@nestjs/common";
import { SheetsService } from "./sheets.service";
import { ConfigModule } from "../config/config.module";
import { SheetsUpdate } from "./sheets.update";

@Module({
    imports: [ConfigModule],
    providers: [SheetsService, SheetsUpdate],
    exports: [SheetsService],
})
export class SheetsModule {
}

import { Module } from "@nestjs/common";
import { GoogleSheetsModule } from "../google/sheets/googleSheets.module";
import { TransactionsService } from "./transactions.service";

@Module({
    imports: [GoogleSheetsModule],
    providers: [TransactionsService],
    exports: [TransactionsService]
})
export class TransactionsModule {
}

import { Module } from "@nestjs/common";
import { GoogleSheetsModule } from "../google/sheets/googleSheets.module";
import { CategoriesService } from "./categories.service";

@Module({
    imports: [GoogleSheetsModule],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}

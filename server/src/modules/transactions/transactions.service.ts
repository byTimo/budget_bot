import { Injectable } from "@nestjs/common";
import { GoogleSheetsService } from "../google/sheets/googleSheets.service";
import { Transaction } from "./transactions.contracts";
import { format, parse } from "date-fns";

@Injectable()
export class TransactionsService {
    constructor(private readonly googleSheets: GoogleSheetsService) {
    }

    public async save({ date, sum, category }: Transaction): Promise<void> {
        const sheet = `${format(parse(date, "dd.MM.yyyy", new Date()), "MMMM")}`;
        const range = `${sheet}!A:C`;
        await this.googleSheets.write({
            range,
            majorDimension: "ROWS",
            values: [
                [date, sum, category]
            ]
        });
    }
}

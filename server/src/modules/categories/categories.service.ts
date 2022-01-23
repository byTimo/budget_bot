import { Injectable } from "@nestjs/common";
import { GoogleSheetsService } from "../google/sheets/googleSheets.service";
import { add, isBefore } from "date-fns";

const CACHE_TTL_MINS = 30; //30min

@Injectable()
export class CategoriesService {
    private cached: string[] | undefined;
    private cacheUpdateTime: Date | undefined;

    constructor(private readonly googleSheets: GoogleSheetsService) {
    }

    async popular(): Promise<string[]> {
        if (this.cacheUpdateTime && this.cached && isBefore(new Date(), this.cacheUpdateTime)) {
            return this.cached;
        }

        const categories = await this.googleSheets.selectInternal("categories");
        this.cached = categories;
        this.cacheUpdateTime = add(new Date(), { minutes: CACHE_TTL_MINS });

        return categories;
    }
}

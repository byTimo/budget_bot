import { Injectable } from "@nestjs/common";
import { GoogleSheetsService } from "../google/sheets/googleSheets.service";
import { add, isBefore } from "date-fns";
import { chain } from "iterable-chain";

const CACHE_TTL_MINS = 30; //30min

@Injectable()
export class CategoriesService {
    private cached: string[] | undefined;
    private cacheUpdateTime: Date | undefined;

    constructor(private readonly googleSheets: GoogleSheetsService) {
    }

    async suggestInitial(): Promise<string> {
        const categories = await this.resolveCategories();
        return categories[0];
    }

    async suggestFast(current?: string): Promise<string[]> {
        const categories = await this.resolveCategories();
        return chain(categories).filter(x => x !== current).take(4).toArray();
    }

    suggestAll(): Promise<string[]> {
        return this.resolveCategories();
    }

    private async resolveCategories(): Promise<string[]> {
        if (this.cacheUpdateTime && this.cached && isBefore(new Date(), this.cacheUpdateTime)) {
            return this.cached;
        }

        const categories = await this.googleSheets.selectInternal("categories");
        this.cached = categories;
        this.cacheUpdateTime = add(new Date(), { minutes: CACHE_TTL_MINS });

        return categories;
    }
}

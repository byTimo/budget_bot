import { Injectable, Logger } from "@nestjs/common";
import { format, add, parse, isAfter } from "date-fns";

const dateFormat = "dd.MM.yyyy";

@Injectable()
export class DatesService {
    private _lastUsed?: string;

    constructor(private readonly logger: Logger) {
    }

    public static get dateFormat() {
        return dateFormat;
    }

    public suggestInitialDate(): string {
        return this._lastUsed ?? this.now();
    }

    public saveLastUsed(date: string): void {
        this._lastUsed = date;
        this.logger.log(`Date ${date} was saved`);
    }

    public suggestFastDates(current?: string): string[] {
        const basis = current || this._lastUsed
            ? parse(current || this._lastUsed!, dateFormat, new Date())
            : new Date();
        const yesterday = add(new Date(), { days: -1 });

        if (isAfter(yesterday, basis)) {
            return [
                this.now(),
                ...Array.from({ length: 3 })
                    .map((_, i) => format(add(basis, { days: 1 - i }), dateFormat))
            ];
        }

        return Array.from({ length: 4 })
            .map((_, i) => format(add(basis, { days: -i - 1 }), dateFormat));
    }

    public now(): string {
        return format(new Date(), dateFormat);
    }
}

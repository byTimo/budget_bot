import { Injectable, Logger } from "@nestjs/common";
import { format, add, parse, isAfter } from "date-fns";
import { chain } from "iterable-chain";

const dateFormat = "dd.MM.yyyy";

@Injectable()
export class DatesService {
    private _lastUsed?: string;

    constructor(private readonly logger: Logger) {
    }

    public static get dateFormat() {
        return dateFormat;
    }

    public suggestInitial(): string {
        return this._lastUsed ?? this.now();
    }

    public saveLastUsed(date: string): void {
        this._lastUsed = date;
        this.logger.log(`Date ${date} was saved`);
    }

    public suggestFast(current?: string): string[] {
        const basis = current || this._lastUsed
            ? parse(current || this._lastUsed!, dateFormat, new Date())
            : new Date();
        const yesterday = add(new Date(), { days: -1 });

        if (isAfter(yesterday, basis)) {
            return chain.range(-1, 3)
                .map(x => add(basis, { days: -x }))
                .map(x => format(x, dateFormat))
                //TODO (byTimo) bag in chain
                .append(this.now())
                .toArray();
        }

        return chain.range(1, 4)
            .map(x => add(basis, { days: -x }))
            .map(x => format(x, dateFormat))
            .toArray();
    }

    public now(): string {
        return format(new Date(), dateFormat);
    }
}

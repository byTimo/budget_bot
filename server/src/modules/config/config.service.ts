import { Injectable } from "@nestjs/common";
import { ConfigService as DefaultConfigService } from "@nestjs/config";

const TOKEN = "TG_TOKEN";

@Injectable()
export class ConfigService {
    constructor(private configService: DefaultConfigService) {
    }

    public get token(): string {
        const token = this.configService.get<string>(TOKEN);
        if (token) {
            return token;
        }

        throw new Error("Can't find TG_TOKEN in config");
    }
}

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import localtunnel = require("localtunnel");

@Injectable()
export class TunnelService {
    private url: string | undefined;

    constructor(private readonly logger: Logger, private readonly config: ConfigService) {
    }


    public async getPublic(): Promise<string> {
        if (this.url) {
            return this.url;
        }

        const tunnel = await localtunnel({ port: this.config.telegramWebhookPort });

        this.logger.log(`The tunnel to localhost:${this.config.telegramWebhookPort} was opened at ${tunnel.url}`);
        tunnel.on("close", () => {
            this.logger.log("Tunnel was closed");
        });

        this.url = tunnel.url;
        return tunnel.url;
    }
}

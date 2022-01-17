import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
    constructor(private readonly logger: Logger) {
    }

    use(request: Request, response: Response, next: NextFunction): void {
        response.on("finish", () => {
            const { method, originalUrl } = request;
            const { statusCode } = response;

            const message = `${statusCode} ${method} ${originalUrl}`;

            if (statusCode >= 500) {
                return this.logger.error(message);
            }

            if (statusCode >= 400) {
                return this.logger.warn(message);
            }

            return this.logger.log(message);
        });

        next();
    }
}

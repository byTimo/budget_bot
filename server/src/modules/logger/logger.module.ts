import { Module, Logger, Provider, LoggerService } from "@nestjs/common";
import { WinstonModule, utilities, WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import * as winston from "winston";

const logProvider: Provider = {
    provide: Logger,
    useFactory: (winstonLogger: LoggerService) => winstonLogger,
    inject: [WINSTON_MODULE_NEST_PROVIDER]
};

@Module({
    imports: [
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        utilities.format.nestLike("Budget", { prettyPrint: true })
                    )
                }),
                new winston.transports.File({
                    filename: "log.log",
                    dirname: "logs",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        utilities.format.nestLike()
                    )
                })
            ]
        })
    ],
    providers: [logProvider],
    exports: [logProvider]
})
export class LoggerModule {}

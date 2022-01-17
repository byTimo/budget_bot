import { Injectable, Logger } from "@nestjs/common";
import { FileReadResult, FileWriteResult } from "./files.contracts";
import { readFile, writeFile } from "fs";

@Injectable()
export class FilesService {
    constructor(private readonly logger: Logger) {
    }

    public read(path: string, encoding: BufferEncoding): Promise<FileReadResult> {
        return new Promise(resolve => readFile(
            path,
            { encoding },
            (err, data) => {
                if (err) {
                    this.logger.error(`Error occurred when file ${path} was tried to read: ${err.message}`, err.stack);
                    resolve({ success: false });
                } else {
                    this.logger.log(`File ${path} has been read`);
                    resolve({ success: true, data });
                }
            }
        ));
    }

    public write(path: string, data: string, encoding: BufferEncoding): Promise<FileWriteResult> {
        return new Promise(resolve => writeFile(
            path,
            data,
            { encoding }, (err) => {
                if (err) {
                    this.logger.error(`Error occurred when file ${path} was tried to write: ${err.message}`, err.stack);
                    resolve({ success: false });
                } else {
                    this.logger.log(`File ${path} has been written`);
                    resolve({ success: true });
                }
            }
        ));
    }
}

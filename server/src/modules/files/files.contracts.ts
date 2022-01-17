export interface FileReadSuccess {
    success: true;
    data: string;
}

export interface FileReadFail {
    success: false;
}

export type FileReadResult = FileReadFail | FileReadSuccess;

export interface FileWriteSuccess {
    success: true;
}

export interface FileWriteFail {
    success: false;
}

export type FileWriteResult = FileWriteFail | FileWriteSuccess;

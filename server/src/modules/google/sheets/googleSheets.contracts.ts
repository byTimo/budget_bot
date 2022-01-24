export type Dimension = "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";

export type InternalType = "categories";

export type ValueRange = {
    majorDimension: Dimension;
    range: string;
    values: any[][];
}

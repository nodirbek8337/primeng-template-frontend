export interface PrimeGetRowsParams {
    first: number;
    rows: number;
    sortField?: string;
    sortOrder?: number;
    filters?: { [key: string]: any };
    successCallback: (data: any[], total: number) => void;
}

export interface PrimeDataSource {
    getRows: (params: PrimeGetRowsParams) => void;
}

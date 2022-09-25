import type { Tables } from "@/models/tables/tables";

type TableColumnMapping<TableName extends keyof Tables> = {
    tableName: TableName;
    columnMappings: {
        [Key in keyof Tables[TableName]]?: string;
    }
}

type CreateFieldsString = <Mapping extends TableColumnMapping<keyof Tables>>(...mappings: Mapping[]) => string;

export const createFieldsString: CreateFieldsString = (...mappings): string =>
    mappings.map(({ tableName, columnMappings }) => Object.entries(columnMappings)
        .filter((e): e is [string, string] => e[1] !== undefined)
        .map(([column, alias]) => `${tableName}.${column}=${alias}`)
        .join(",")
    ).join(",");

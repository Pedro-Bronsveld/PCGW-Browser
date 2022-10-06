import type { AnyTable, Tables } from "../tables/tables";

// export type Filter<TableName extends keyof Tables, T extends Extract<AnyTable, { __tableName: TableName }> = Extract<AnyTable, { __tableName: TableName }>> = {
export type Filter<TableName extends keyof Tables> = {
    title: string;
    options: Map<number, FilterOption>;
    valueFilter: boolean;
    andCheckbox: boolean;
    and: boolean;
    sortAlphabetical: boolean;
    sortCheckbox: boolean;
    table: TableName & string,
    column: keyof Tables[TableName] & string
    // table: T["__tableName"] & string,
    // column: keyof Omit<T, "__tableName"> & string
};

export type GenericFilter = Filter<keyof Tables>

export type FilterOption = {
    number: number,
    value: string;
    enabled: boolean;
}

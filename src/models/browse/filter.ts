import type { Tables } from "../tables/tables";

export type Filter<TableName extends keyof Tables, ColumnName extends keyof Tables[TableName]> = {
    title: string;
    options: Map<number, FilterOption>;
    valueFilter: boolean;
    andCheckbox: boolean;
    and: boolean;
    sortAlphabetical: boolean;
    sortCheckbox: boolean;
    table: TableName & string,
    column: ColumnName & string
};

export type GenericFilter = Filter<keyof Tables, keyof Tables[keyof Tables]>

export type FilterOption = {
    number: number,
    value: string;
    enabled: boolean;
}

import type { Tables } from "../tables/tables";

export type Filter<TableName extends keyof Tables> = {
    title: string;
    options: Map<number, FilterOption>;
    valueFilter: boolean;
    andCheckbox: boolean;
    and: boolean;
    sortAlphabetical: boolean;
    sortCheckbox: boolean;
    table: TableName & string;
    isList?: boolean;
    radio?: boolean;
} & ({
    valuesAreColumns: true,
    enabledValues: readonly string[]
} | {
    valuesAreColumns?: false,
    column: keyof Tables[TableName] & string;
});

export type GenericFilter = Filter<keyof Tables>

export type FilterOption = {
    number: number,
    value: string;
    enabled: boolean;
}

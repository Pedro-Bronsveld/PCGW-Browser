import type { Tables } from "../tables/tables";

export type PropColumnMap<TableName extends keyof Tables, Props extends string, PropsColumns extends Record<Props, keyof Tables[TableName]> = Record<Props, keyof Tables[TableName]>> = {
    tableName: TableName;
    props: PropsColumns
}

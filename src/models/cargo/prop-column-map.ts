import type { Tables } from "../tables/tables";

export type PropColumnMap<TableName extends keyof Tables & string, Props extends string> = {
    tableName: TableName;
    props: Record<Props, keyof Tables[TableName]>
}

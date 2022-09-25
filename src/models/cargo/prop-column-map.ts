import type { Tables } from "../tables/tables";

export type PropColumnMap<TableName extends keyof Tables, Props extends string> = {
    tableName: TableName;
    props: {
        [Key in Props]: keyof Tables[TableName];
    }
}

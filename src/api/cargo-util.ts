import type { PropColumnMap } from "@/models/cargo/prop-column-map";
import type { Tables } from "@/models/tables/tables";

type CreatePropColumnMap = <TableName extends keyof Tables, Props extends string>(talbeName: TableName, props: PropColumnMap<TableName, Props>["props"]) => PropColumnMap<TableName, Props>

export const createPropColumnMap: CreatePropColumnMap = (tableName, props) => ({
    tableName,
    props
});

type CreateFieldsString = <TableName extends keyof Tables, Mapping extends PropColumnMap<TableName, string>>(...mappings: Mapping[]) => string;

export const createFieldsString: CreateFieldsString = (...mappings) =>
    mappings.map(({ tableName, props: columnMappings }) => Object.entries(columnMappings)
        .map(([alias, column]) => `${tableName}.${String(column)}=${alias}`)
        .join(",")
    ).join(",");

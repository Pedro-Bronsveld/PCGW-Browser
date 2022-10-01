import type { CargoQueryParameters, SingleWhereString } from "@/models/cargo/cargo-query-parameters";
import type { PropColumnMap } from "@/models/cargo/prop-column-map";
import type { Tables } from "@/models/tables/tables";

type CreateCargoQueryParams = <Params extends CargoQueryParameters>(params: Params) => Params;

export const createCargoQueryParams: CreateCargoQueryParams = (params) => params;

type CreatePropColumnMap = <TableName extends keyof Tables, Props extends string, PCMap extends PropColumnMap<TableName, Props>, PropMap extends PCMap["props"]>(talbeName: TableName, props: PropMap) => { 
    tableName: TableName,
    props: PropMap
}

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

type CreateWhereString = <TableName extends keyof Tables, TableColumn extends keyof Tables[TableName] & string>
    (...queryStrs: (SingleWhereString<TableName, TableColumn> | "AND" | "OR" | "NOT")[]) => string;

export const createWhereString: CreateWhereString = (...queryStrings) => queryStrings.join(" ");
    
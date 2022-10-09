import type { Filter } from "@/models/browse/filter";
import type { CargoQueryParameters } from "@/models/cargo/cargo-query-parameters";
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

type CreateFieldsString = <TableName extends keyof Tables>(...mappings: PropColumnMap<TableName, string>[]) => string;

export const createFieldsString: CreateFieldsString = (...mappings) =>
    mappings.map(({ tableName, props: columnMappings }) => Object.entries(columnMappings)
        .map(([alias, column]) => `${tableName}.${String(column)}=${alias}`)
        .join(",")
    ).join(",");

type SingleWhereString<TableName extends keyof Tables, TableColumn extends keyof Tables[TableName] & string> = 
    `${TableColumn}${" " | "="}${string}`

type CreateWhereString = <TableName extends (keyof Tables) & string>
    (tableName: TableName, ...queryStr: (SingleWhereString<TableName, keyof Tables[TableName] & string> | "AND" | "OR" | "NOT")[]) => string;

export const createWhereString: CreateWhereString = (tableName, queryString) => `${tableName}.${queryString}`;
    
export const filterToWhereString = <TableName extends (keyof Tables) & string>(filter: Filter<TableName>, combineOperator?: " AND " | " OR ") =>
    [...filter.options.values()]
    .filter(option => option.enabled)
    .map(option => createWhereString(filter.table, `${filter.column}${filter.isList === true ? " HOLDS " : "="}'${option.value}'`))
    .join(combineOperator === undefined ? filter.and ? " AND " : " OR " : combineOperator);

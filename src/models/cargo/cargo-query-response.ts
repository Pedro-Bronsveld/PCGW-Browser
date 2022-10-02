import type { GenericColumn } from "../tables/column";
import type { Tables, TableStructures } from "../tables/tables";
import type { PropColumnMap } from "./prop-column-map";

type KeysMatchingType<T extends Object, MatchType> = {
    [Key in keyof T]: T[Key] extends MatchType ? Key : never;
}[keyof T]

type AllExtraPropsKeys<Structure extends TableStructures[keyof TableStructures]> = {
    [Key in keyof Structure]: Structure[Key] extends GenericColumn ? Structure[Key]["extraPropPostFix"] extends "" ? never : Key : never;
}[keyof Structure]

export interface CargoQueryResponse<PropMap extends PropColumnMap<keyof Tables, string>> {
    cargoquery: {
        title: { 
            [Key in keyof PropMap["props"]]: 
                TableStructures[PropMap["tableName"]][PropMap["props"][Key]]["nullable"] extends true ? string | null : string
        } & { 
            [Key in KeysMatchingType<PropMap["props"], AllExtraPropsKeys<TableStructures[PropMap["tableName"]]>> & string 
                as `${ Key }${ TableStructures[PropMap["tableName"]][PropMap["props"][Key]]["extraPropPostFix"] }`]: string
        }
    }[];
    warnings?: {
        main: {
            "*": string;
        }
    }
}

export interface CargoQueryError {
    error: {
        code: string;
        info: string;
        "*": string;
        errorClass?: string;
    }
}

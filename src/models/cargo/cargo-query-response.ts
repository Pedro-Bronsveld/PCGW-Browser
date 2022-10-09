import type { KeysMatchingType } from "@/utilities/matching-keys";
import type { GenericColumn } from "../tables/column";
import type { Tables, TableStructures } from "../tables/tables";
import type { PropColumnMap } from "./prop-column-map";

type AllExtraPropsKeys<Structure extends TableStructures[keyof TableStructures]> = {
    [Key in keyof Structure]: Structure[Key] extends GenericColumn ? Structure[Key]["extraPropPostFix"] extends "" ? never : Key : never;
}[keyof Structure]

export interface CargoQueryResponse<PropMap extends Omit<PropColumnMap<keyof Tables, string>, "props"> & { props: Record<string, string> }> {
    cargoquery: {
        title: { 
            [Key in keyof PropMap["props"]]: 
                PropMap["props"][Key] extends keyof TableStructures[PropMap["tableName"]] ? TableStructures[PropMap["tableName"]][PropMap["props"][Key]] extends GenericColumn ?
                    TableStructures[PropMap["tableName"]][PropMap["props"][Key]]["nullable"] extends true ? string | null : string
                    : string | null : string | null
        } & { 
            [Key in KeysMatchingType<PropMap["props"], AllExtraPropsKeys<TableStructures[PropMap["tableName"]]>> & string 
                as `${ Key }${
                    PropMap["props"][Key] extends keyof TableStructures[PropMap["tableName"]] ? TableStructures[PropMap["tableName"]][PropMap["props"][Key]] extends GenericColumn ?
                        TableStructures[PropMap["tableName"]][PropMap["props"][Key]]["extraPropPostFix"] : "__noExtraProp" : "__noExtraProp"
                }`]: string
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

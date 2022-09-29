import type { Tables, TableStructures } from "../tables/tables";
import type { PropColumnMap } from "./prop-column-map";

export interface CargoQueryResponse<PropMap extends PropColumnMap<keyof Tables, string>> {
    cargoquery: {
        title: { [Key in keyof PropMap["props"]]: 
            TableStructures[PropMap["tableName"]][PropMap["props"][Key]]["nullable"] extends true ? string | null : string
        }
    }[];
}

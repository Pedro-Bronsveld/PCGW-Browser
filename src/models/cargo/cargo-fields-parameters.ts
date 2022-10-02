import type { Tables } from "../tables/tables";

export interface CargoFieldsParameters {
    "origin": "*";
    "action": "cargofields";
    "table": keyof Tables & string;
}

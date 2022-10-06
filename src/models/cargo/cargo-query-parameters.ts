import type { Tables } from "../tables/tables";

export interface CargoQueryParameters {
    "origin": "*";
    "action": "cargoquery";
    "tables": string;
    "join_on"?: string;
    "fields": string;
    "where"?: string;
    "group_by"?: string;
    "having"?: string;
    "order_by"?: string;
    "limit"?: `${number}`;
    "offset"?: `${number}`;
    "default"?: string;
    "no_html"?: "";
    "max_display_chars"?: `${number}`;
    "format": "json" | "jsonfm" | "none" | "php" | "phpfm" | "rawfm" | "xml" | "xmlfm";
}

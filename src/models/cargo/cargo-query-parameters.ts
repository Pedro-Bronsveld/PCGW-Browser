import type { SortOrder } from "../browse/sort-option";
import type { AnyTableColumn } from "../tables/tables";

export interface CargoQueryParameters {
    "origin": "*";
    "action": "cargoquery";
    "tables": string;
    "join_on"?: string;
    "fields": string;
    "where"?: string;
    "group_by"?: string;
    "having"?: string;
    "order_by"?: `${string} ${SortOrder}`;
    "limit"?: `${number}`;
    "offset"?: `${number}`;
    "default"?: string;
    "no_html"?: "";
    "max_display_chars"?: `${number}`;
    "format": "json" | "jsonfm" | "none" | "php" | "phpfm" | "rawfm" | "xml" | "xmlfm";
}

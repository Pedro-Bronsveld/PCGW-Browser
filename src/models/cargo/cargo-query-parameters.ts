export interface CargoQueryParameters {
    "origin"?: "*";
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
    "outro"?: string;
    "default"?: string;
    "more_results_text"?: string;
    "no_html"?: "";
    "max_display_chars"?: `${number}`;
    "format": "json" | "jsonfm" | "none" | "php" | "phpfm" | "rawfm" | "xml" | "xmlfm";
}

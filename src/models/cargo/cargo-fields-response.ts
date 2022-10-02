import type { Tables } from "../tables/tables";

export type CargoFieldsResponse<TableName extends keyof Tables> = {
    cargofields: {
        [Key in keyof Tables[TableName]]: CargoField;
    }
}

type CargoFieldBase = {
    type: "String" | "File" | "Page" | "URL" | "Date";
}

export type CargoField = CargoFieldBase | 
    CargoFieldBase & {
        isList: "",
        delimiter: string
    }

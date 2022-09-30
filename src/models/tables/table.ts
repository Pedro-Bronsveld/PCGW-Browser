import type { GenericColumn } from "./column";
import type { GenericTableStructure } from "./generic-table";

export type RawTable<TableStructure extends GenericTableStructure> = {
    [Key in keyof TableStructure]: string;
}

export type Table<TableStructure extends GenericTableStructure> = {
    [Key in keyof TableStructure]: TableStructure[Key] extends GenericColumn ? TableStructure[Key]["type"] : never;
}

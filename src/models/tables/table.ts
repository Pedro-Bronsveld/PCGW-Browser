import type { GenericTableStructure } from "./generic-table";

export type RawTable<TableStructure extends GenericTableStructure> = {
    [Key in keyof TableStructure]: string;
}

export type Table<TableStructure extends GenericTableStructure> = {
    [Key in keyof TableStructure]: TableStructure[Key]["type"];
}

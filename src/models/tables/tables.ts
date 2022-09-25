import type { GenericTableStructure } from "./generic-table";
import type InfoboxGameStructure from "./infobox-game";
import type { RawTable, Table } from "./table";

export interface TableStructures {
    "Infobox_game": InfoboxGameStructure,
}

export type RawTables = {
    [Key in keyof TableStructures]: RawTable<TableStructures[Key]>
}

export type Tables = {
    [Key in keyof TableStructures]: Table<TableStructures[Key]>
}

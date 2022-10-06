import type InfoboxGameStructure from "./infobox-game";
import type L10nStructure from "./l10n";
import type { RawTable, Table } from "./table";

export interface TableStructures {
    "Infobox_game": InfoboxGameStructure,
    "L10n": L10nStructure
}

export type RawTables = {
    [Key in keyof TableStructures]: RawTable<TableStructures[Key]>
}

export type Tables = {
    [Key in keyof TableStructures]: Table<TableStructures[Key]>
}

export type AnyTable = {
    [Key in keyof Tables]: Tables[Key] & { __tableName: Key }
}[keyof Tables];

import type InfoboxGameStructure from "./infobox-game";
import type InputStructure from "./input";
import type L10nStructure from "./l10n";
import type { RawTable, Table } from "./table";

export interface TableStructures {
    "Infobox_game": InfoboxGameStructure,
    "L10n": L10nStructure,
    "Input": InputStructure
}

export type RawTables = {
    [Key in keyof TableStructures]: RawTable<TableStructures[Key]>
}

export type Tables = {
    [Key in keyof TableStructures]: Table<TableStructures[Key]>
}

export type AnyTable = {
    [Key in keyof Tables]: Tables[Key]
}[keyof Tables];

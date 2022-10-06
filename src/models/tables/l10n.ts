import type { Column } from "./column";
import type { GenericTableStructure } from "./generic-table";

export default interface L10nStructure extends GenericTableStructure {
    "Page": Column<string, never, false>,
    "Language": Column<string, never, false>,
    "Status": Column<string, never, false>,
    "Interface": Column<string, never, false>,
    "Audio": Column<string, never, false>,
    "Subtitles": Column<string, never, false>,
    "Notes": Column
}

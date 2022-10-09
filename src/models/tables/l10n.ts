import type { Column } from "./column";
import type { GenericTableStructure } from "./generic-table";

export type LocalizationSupport = "true" | "false" | "hackable" | "limited" | "n/a" | "unknown";

export default interface L10nStructure extends GenericTableStructure {
    "_pageID": Column<number, never, false>,
    "_pageName": Column<string, never, false>,
    "Language": Column<string, never, false>,
    "Status": Column<"official" | "fan", never, false>,
    "Interface": Column<LocalizationSupport, never, false>,
    "Audio": Column<LocalizationSupport, never, false>,
    "Subtitles": Column<LocalizationSupport, never, false>,
    "Notes": Column
}

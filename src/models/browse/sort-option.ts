import type { AnyTableColumn } from "../tables/tables";

export interface SortOption {
    label: string;
    value: string;
}

export type SortOrder = "ASC" | "DSC";

export interface GameSortOption {
    label: string;
    value: AnyTableColumn
}

import type { BrowseFilters } from "@/constants/default-filters";
import type { AnyTableColumn } from "../tables/tables";
import type { SortOrder } from "./sort-option";

export interface SearchGamesOptions {
    inTitle: string;
    filters: BrowseFilters;
    limit: number;
    sortColumn?: AnyTableColumn;
    sortDescending?: boolean;
    offset?: number;
}

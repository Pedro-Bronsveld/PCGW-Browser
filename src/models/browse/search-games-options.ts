import type { BrowseFilters } from "@/constants/default-filters";
import type Game from "../game";

export interface BaseSearchGamesOptions {
    inTitle: string;
    filters: BrowseFilters;
    sortColumn: keyof Game;
    sortDescending: boolean;
}
export interface SearchGamesOptions extends BaseSearchGamesOptions {
    limit: number;
    offset?: number;
}

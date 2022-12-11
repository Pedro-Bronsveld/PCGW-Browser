import type { BrowseFilters } from "@/constants/default-filters";
import type Game from "../game";

export interface SearchGamesOptions {
    inTitle: string;
    filters: BrowseFilters;
    limit: number;
    sortColumn?: keyof Game;
    sortDescending?: boolean;
    offset?: number;
}

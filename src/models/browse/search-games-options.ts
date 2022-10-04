import type { BrowseFilters } from "@/constants/default-filters";

export interface SearchGamesOptions {
    inTitle: string;
    filters: BrowseFilters;
    limit: number;
}

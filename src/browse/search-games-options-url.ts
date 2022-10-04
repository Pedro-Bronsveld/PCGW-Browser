import type { SearchGamesOptions } from "@/models/browse/search-games-options";
import type { LocationQuery } from "vue-router";
import { filtersToQueryParams, queryParamsToFilters } from "./filters-url";

export const searchGamesOptionsToQueryParams = (searchGamesOptions: SearchGamesOptions, limit?: number) => ({
    ...(searchGamesOptions.inTitle !== "" ? {
        inTitle: searchGamesOptions.inTitle
    } : {}),
    ...(limit !== undefined ? {
        limit
    } : {}),
    ...filtersToQueryParams(searchGamesOptions.filters)
});

export const queryParamsToSearchGamesOptions = (queryParams: LocationQuery, destOptions: SearchGamesOptions): boolean => {
    let optionsChanged = false;
    const newInTitle = queryParams.inTitle !== undefined ? String(queryParams.inTitle) : "";
    if (newInTitle !== destOptions.inTitle)
        optionsChanged = true;
    destOptions.inTitle = newInTitle;
    const filtersChanged = queryParamsToFilters(queryParams, destOptions.filters);
    return optionsChanged || filtersChanged;
}

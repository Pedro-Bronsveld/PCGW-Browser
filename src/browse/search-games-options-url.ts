import { getDefaultGameSortOptions } from "@/constants/default-sort-options";
import type { SearchGamesOptions } from "@/models/browse/search-games-options";
import type Game from "@/models/game";
import type { LocationQuery } from "vue-router";
import { filtersToQueryParams, queryParamsToFilters } from "./filters-url";

export const searchGamesOptionsToQueryParams = (searchGamesOptions: SearchGamesOptions, limit?: number) => ({
    ...(searchGamesOptions.inTitle !== "" ? {
        inTitle: searchGamesOptions.inTitle
    } : {}),
    ...(searchGamesOptions.sortColumn !== undefined && searchGamesOptions.sortColumn !== "pageId" ? {
        sortColumn: searchGamesOptions.sortColumn
    } : {}),
    ...(searchGamesOptions.sortDescending ? {
        sortDescending: String(searchGamesOptions.sortDescending)
    } : {}),
    ...(limit !== undefined ? {
        limit
    } : {}),
    ...filtersToQueryParams(searchGamesOptions.filters)
});

export const queryParamsToSearchGamesOptions = (queryParams: LocationQuery, destOptions: SearchGamesOptions): boolean => {
    let optionsChanged = false;

    const validSortColumns = getDefaultGameSortOptions().map(sortOption => sortOption.value);
    
    // extract new search option values from query params
    const newInTitle = queryParams.inTitle !== undefined ? String(queryParams.inTitle) : "";
    const newSortColumn = queryParams.sortColumn !== undefined && (validSortColumns as string[] ).includes(String(queryParams.sortColumn)) ? String(queryParams.sortColumn) as keyof Game : "pageId";
    const newSortDescending = queryParams.sortDescending !== undefined ? Boolean(queryParams.sortDescending) : false;

    // check if any options have changed
    optionsChanged = newInTitle !== destOptions.inTitle || newSortColumn !== destOptions.sortColumn || newSortDescending !== destOptions.sortDescending

    // assign new values to destination options object
    destOptions.inTitle = newInTitle;
    destOptions.sortColumn = newSortColumn;
    destOptions.sortDescending = newSortDescending;

    const filtersChanged = queryParamsToFilters(queryParams, destOptions.filters);
    return optionsChanged || filtersChanged;
}

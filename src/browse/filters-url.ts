import type { BrowseFilters } from "@/constants/default-filters";
import { fromEntries } from "@/utilities/object-utils";
import type { LocationQuery } from "vue-router";

export const filtersToQueryParams = (filters: BrowseFilters): Record<string, string> =>
    fromEntries(
        Object.entries(filters)
                .map<[string, string]>(([key, filter]) => 
                [key, [...filter.options.values()]
                .filter(option => option.enabled)
                .map(option => option.value)
                .join(",")]
        ).concat(
            Object.entries(filters)
                .filter(([, filter]) => filter.and && 
                    [...filter.options.values()].some(filterOption => filterOption.enabled)
                )
                .map<[string, string]>(([key, filter]) =>
                    [`${key}And`, String(filter.and)]
                )
        ).filter(([, filterOptionsList]) => filterOptionsList.length > 0)
    );

export const queryParamsToFilters = (queryParams: LocationQuery, destFilters: BrowseFilters): boolean => {
    let filtersChanged = false;
    Object.entries(destFilters).forEach(([key, filter]) => {
        const value = queryParams[key] as string | undefined;

        // Filter option names to filter object
        const queryNames = value?.split(",").filter(v => v !== "") ?? [];
        [...filter.options.entries()]
        .forEach(([id, filterOption]) => {
            const newEnabled = queryNames.includes(filterOption.value);
            if (newEnabled === filterOption.enabled)
                return;
            filterOption.enabled = newEnabled
            filtersChanged = true;
        });

        // And checkbox to filter object
        const newAnd = queryParams[`${key}And`] === "true" ? true : false;
        if (newAnd === filter.and)
            return;
        filter.and = newAnd;
        filtersChanged = true;
    });
    return filtersChanged;
}

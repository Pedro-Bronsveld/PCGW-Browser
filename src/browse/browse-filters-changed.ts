import type { BrowseFilters } from "@/constants/default-filters";
import { mapsEqual } from "@/utilities/maps-equal";
import { getKeys } from "@/utilities/object-utils";
import { anyOptionsEnabled } from "./filter-options-util";

export const browseFiltersChanged = (browseFilters: BrowseFilters, activeFilters: BrowseFilters): boolean => {
    const filtersKeys = getKeys(browseFilters);
    
    for (const key of filtersKeys) {
        const filter = browseFilters[key];
        const activeFilter = activeFilters[key];
        
        if (!mapsEqual(filter.options, activeFilter.options))
            return true;

        if (filter.and === activeFilter.and)
            continue;

        if (anyOptionsEnabled(filter))
            return true;

    }

    return false;
}

import type { BrowseFilters } from "@/constants/default-filters";
import { filtersList } from "./browse-filters-list";
import { anyOptionsEnabled } from "./filter-options-util";

export const anyBrowseFilters = (browseFilters: BrowseFilters): boolean => {
    const filters = filtersList(browseFilters);
    for (const filter of filters) {
        if (filter.and || anyOptionsEnabled(filter))
            return true;
    }
    return false;
}

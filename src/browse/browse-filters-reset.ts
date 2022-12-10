import type { BrowseFilters } from "@/constants/default-filters";
import type { Filter } from "@/models/browse/filter";
import { filtersList } from "./browse-filters-list";

export const resetBrowseFilters = (browseFilters: BrowseFilters) => filtersList(browseFilters).forEach(filter => resetBrowseFilter(filter));

export const resetBrowseFilter = <F extends BrowseFilters[keyof BrowseFilters]>(filter: F) => {
    filter.and = false;
    filter.options.forEach(option => option.enabled = false);
}

import type { BrowseFilters } from "@/constants/default-filters";
import { getKeys } from "@/utilities/object-utils";

export const filtersList = (browseFilters: BrowseFilters) => getKeys(browseFilters)
    .map(filterKey => browseFilters[filterKey]);

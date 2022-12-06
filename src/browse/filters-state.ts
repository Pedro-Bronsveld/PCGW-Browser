import type { BrowseFilters } from "@/constants/default-filters";
import { deepCopyObject, getKeys } from "@/utilities/object-utils";

type BrowseFiltersState = { [Key in keyof BrowseFilters]: Pick<BrowseFilters[Key], "title" | "options" | "and"> }

/**
 * Creates a subset of the given BrowseFilters object,
 * containing only the properties used in a game search.
 * @param filters BrowseFilters object
 */
export const getFiltersState = (filters: BrowseFilters): BrowseFiltersState => {
    const shallowCopy: BrowseFiltersState = { ...filters };

    getKeys(shallowCopy)
    .forEach(key => {
        shallowCopy[key] = {
            title: shallowCopy[key].title,
            options: shallowCopy[key].options,
            and: shallowCopy[key].and,
        }
    });

    return shallowCopy;
}

import type { FilterOption } from "@/models/browse/filter";

export type FilterOptionsSortMode = "default" | "alphabetical";

export const sortFilterOptions = (options: FilterOption[], mode: FilterOptionsSortMode = "alphabetical") => {
    if (mode === "default")
        return options;
    return options.sort((option1, option2) => {
        if ( option1.value < option2.value )
            return -1;
        if ( option1.value > option2.value )
            return 1;
        return 0;
    });
}

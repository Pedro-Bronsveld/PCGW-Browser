import type { GameSortOption } from "@/models/browse/sort-option";

export const getDefaultGameSortOptions = (): GameSortOption[] => [
    {
        label: "Default",
        value: "_pageID"
    },
    {
        label: "Title",
        value: "_pageName"
    },
    {
        label: "Release Date",
        value: "Released"
    }
]

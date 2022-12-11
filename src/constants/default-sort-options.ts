import type { GameSortOption } from "@/models/browse/sort-option";

export const getDefaultGameSortOptions = (): GameSortOption[] => [
    {
        label: "Default",
        value: "pageId"
    },
    {
        label: "Title",
        value: "page"
    },
    {
        label: "Release Date",
        value: "releaseDate"
    }
]

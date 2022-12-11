import type Game from "../game";

export interface SortOption {
    label: string;
    value: string;
}

export type SortOrder = "ASC" | "DESC";

export interface GameSortOption {
    label: string;
    value: keyof Game;
}

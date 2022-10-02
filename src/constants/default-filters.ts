import type { Filter, FilterOption } from "@/models/browse/filter";
import type { Tables } from "@/models/tables/tables";

const options = (...values: string[]): Map<number, FilterOption> => new Map(values.map((value, number) => [number, {
    number,
    value,
    enabled: false
}]));

const filter = <TableName extends keyof Tables, F extends Filter<TableName, keyof Tables[TableName]>>(filter: F): F => filter;

export const getDefaultFilters = () => {
    const defaultFilters = {
        controls: filter({
            title: "Controls",
            options: options(
                "Direct control",
                "Point and select",
                "Gestures",
                "Multiple select",
                "Menu-based",
                "Voice control",
                "Text input",
                "Point and click"
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Controls"
        }),
        modes: filter({
            title: "Modes",
            options: options(
                "Singleplayer",
                "Multiplayer"
            ),
            valueFilter: false,
            andCheckbox: true,
            and: false,
            sortAlphabetical: false,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Modes"
        }),
        genres: filter({
            title: "Genres",
            options: options(
                "Platform",
                "Tile matching",
                "Party game",
                "Adventure",
                "FPS",
                "Action",
                "Visual novel",
                "Shooter",
                "Sports",
                "Metroidvania",
                "Roguelike",
                "Racing",
                "Hidden object",
                "Building",
                "Puzzle",
                "Open world",
                "JRPG",
                "RPG",
                "Rail shooter",
                "Stealth",
                "Tower defense",
                "Vehicle combat",
                "Brawler",
                "Strategy",
                "Fighting",
                "ARPG",
                "Card/tile",
                "Hack and slash",
                "RTS",
                "Trivia/quiz",
                "MMORPG",
                "Survival",
                "Board",
                "Life sim",
                "Simulation",
                "Immersive sim",
                "Music/rhythm",
                "Endless runner",
                "Arcade",
                "Survival horror",
                "CCG",
                "Pinball",
                "Idle",
                "Quick time events",
                "Educational",
                "Interactive book",
                "Tricks",
                "Paddle",
                "Tactical RPG",
                "Chess",
                "Mini-games",
                "Artillery",
                "Driving",
                "TPS",
                "Wargame",
                "Tactical shooter",
                "Sandbox",
                "4X",
                "TBS",
                "MMO",
                "Rolling ball",
                "Business",
                "Dating",
                "Battle royale",
                "Text adventure",
                "Gambling/casino",
                "Mental training",
                "Hunting",
                "Falling block",
                "Word",
                "Time management",
                "Vehicle simulator",
                "Clicker"
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Genres"
        })
    };
    return defaultFilters;
};

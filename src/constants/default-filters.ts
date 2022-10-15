import type { Filter, FilterOption } from "@/models/browse/filter";
import type { Tables } from "@/models/tables/tables";

const options = (...values: string[]): Map<number, FilterOption> => new Map(values.map((value, number) => [number, {
    number,
    value,
    enabled: false
}]));

const filter = <TableName extends keyof Tables>(filter: Filter<TableName>): 
    Filter<TableName> => filter;

export const getDefaultFilters = () => {
    const defaultFilters = {
        languages: filter({
            title: "Languages",
            options: options(
                "English",
                "Japanese",
                "Russian",
                "Simplified Chinese",
                "Traditional Chinese",
                "French",
                "German",
                "Italian",
                "Portuguese",
                "Spanish",
                "Ukrainian",
                "Arabic",
                "Brazilian Portuguese",
                "Polish",
                "Czech",
                "Dutch",
                "Hungarian",
                "Korean",
                "Norwegian",
                "Turkish",
                "Latin American Spanish",
                "Romanian",
                "Vietnamese",
                "Bulgarian",
                "Danish",
                "Finnish",
                "Greek",
                "Swedish",
                "Thai",
                "Catalan",
                "Albanian",
                "Belarusian",
                "Croatian",
                "Estonian",
                "Georgian",
                "Hebrew",
                "Hindi",
                "Indonesian",
                "Latvian",
                "Lithuanian",
                "Malay",
                "Persian",
                "Serbian",
                "Slovak",
                "Slovenian",
                "Tagalog",
                "Basque",
                "Galician",
                "Scottish Gaelic",
                "Canadian French",
                "Welsh",
                "Irish",
                "Filipino",
                "Icelandic",
                "Northern Sami",
                "Macedonian",
                "Breton",
                "Inuktitut",
                "Afrikaans",
                "Slovene",
                "Azerbaijani",
                "Farsi",
                "Kannada",
                "Kazakh",
                "Tamil",
                "Armenian",
                "Asturian",
                "Bashkir",
                "Bosnian",
                "Cornish",
                "Faroese",
                "Frisian",
                "Igbo",
                "Kurdish",
                "Latin",
                "Luxembourgish",
                "Maltese",
                "Mongolian",
                "Nepali",
                "Ripuarian",
                "Tatar",
                "Valencian",
                "Yiddish",
                "Yoruba",
                "Māori",
                "Inupiaq",
                "Cantonese",
            ),
            valueFilter: true,
            andCheckbox: false,
            and: false,
            sortAlphabetical: false,
            sortCheckbox: true,
            table: "L10n",
            column: "Language",
            radio: true
        }),
        languageSupport: filter({
            title: "Language Support",
            options: options(
                "Interface",
                "Audio",
                "Subtitles"
            ),
            valueFilter: false,
            andCheckbox: true,
            and: false,
            sortAlphabetical: false,
            sortCheckbox: false,
            table: "L10n",
            column: "Interface",
            valuesAreColumns: true,
            enabledValues: ["true", "hackable", "limited"] as const
        }),
        controls: filter({
            title: "Controls",
            options: options(
                "Direct control",
                "Gestures",
                "Menu-based",
                "Multiple select",
                "Point and click",
                "Point and select",
                "Text input",
                "Voice control",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Controls",
            isList: true
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
            column: "Modes",
            isList: true
        }),
        genres: filter({
            title: "Genres",
            options: options(
                "4X",
                "Action",
                "Adventure",
                "Arcade",
                "ARPG",
                "Artillery",
                "Battle royale",
                "Board",
                "Brawler",
                "Building",
                "Business",
                "Card/tile",
                "CCG",
                "Chess",
                "Clicker",
                "Dating",
                "Driving",
                "Educational",
                "Endless runner",
                "Falling block",
                "Fighting",
                "FPS",
                "Gambling/casino",
                "Hack and slash",
                "Hidden object",
                "Hunting",
                "Idle",
                "Immersive sim",
                "Interactive book",
                "JRPG",
                "Life sim",
                "Mental training",
                "Metroidvania",
                "Mini-games",
                "MMO",
                "MMORPG",
                "Music/rhythm",
                "Open world",
                "Paddle",
                "Party game",
                "Pinball",
                "Platform",
                "Puzzle",
                "Quick time events",
                "Racing",
                "Rail shooter",
                "Roguelike",
                "Rolling ball",
                "RPG",
                "RTS",
                "Sandbox",
                "Shooter",
                "Simulation",
                "Sports",
                "Stealth",
                "Strategy",
                "Survival horror",
                "Survival",
                "Tactical RPG",
                "Tactical shooter",
                "TBS",
                "Text adventure",
                "Tile matching",
                "Time management",
                "Tower defense",
                "TPS",
                "Tricks",
                "Trivia/quiz",
                "Vehicle combat",
                "Vehicle simulator",
                "Visual novel",
                "Wargame",
                "Word",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Genres",
            isList: true
        }),
        artStyles: filter({
            title: "Art Styles",
            options: options(
                "Abstract",
                "Anime",
                "Cartoon",
                "Cel-shaded",
                "Comic book",
                "Digitized",
                "FMV",
                "Live Action",
                "Pixel art",
                "Pre-rendered graphics",
                "Realistic",
                "Stylized",
                "Vector art",
                "Video backdrop",
                "Voxel art",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Art_styles",
            isList: true
        }),
        availableOn: filter({
            title: "Available On",
            options: options(
                "Windows",
                "Mac OS",
                "Linux",
                "OS X",
                "DOS",
                "PC booter",
                "Windows 3.x",
            ),
            valueFilter: false,
            andCheckbox: true,
            and: false,
            sortAlphabetical: false,
            sortCheckbox: true,
            table: "Infobox_game",
            column: "Available_on",
            isList: true
        }),
        monetization: filter({
            title: "Monetization",
            options: options(
                "Ad-supported",
                "DLC",
                "Expansion pack",
                "Free-to-play",
                "Freeware",
                "One-time game purchase",
                "Sponsored",
                "Subscription",
            ),
            valueFilter: false,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Monetization",
            isList: true
        }),
        microtransactions: filter({
            title: "Microtransactions",
            options: options(
                "Boost",
                "Cosmetic",
                "Currency",
                "finite spend",
                "Free-to-grind",
                "Infinite spend",
                "loot box",
                "No microtransactions",
                "None",
                "Player trading",
                "Subscription",
                "Time-limited",
                "Unlock",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortAlphabetical: true,
            sortCheckbox: false,
            table: "Infobox_game",
            column: "Microtransactions",
            isList: true
        }),
        pacing: filter({
            title: "Pacing",
            options: options(
                "Continuous turn-based",
                "Persistent",
                "Real-time",
                "Relaxed",
                "Turn-based",
            ),
            valueFilter: false,
            andCheckbox: true,
            and: false,
            sortCheckbox: false,
            sortAlphabetical: true,
            table: "Infobox_game",
            column: "Pacing",
            isList: true
        }),
        perspectives: filter({
            title: "Perspectives",
            options: options(
                "Audio-based",
                "Bird's-eye view",
                "Cinematic camera",
                "First-person",
                "Flip screen",
                "Free-roaming camera",
                "Isometric",
                "Scrolling",
                "Side view",
                "Text-based",
                "Third-person",
                "Top-down view",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortCheckbox: false,
            sortAlphabetical: true,
            table: "Infobox_game",
            column: "Perspectives",
            isList: true
        }),
        themes: filter({
            title: "Themes",
            options: options(
                "Adult",
                "Africa",
                "Amusement park",
                "Antarctica",
                "Arctic",
                "Asia",
                "China",
                "Classical",
                "Cold War",
                "Comedy",
                "Contemporary",
                "Cyberpunk",
                "Detective/mystery",
                "Eastern Europe",
                "Egypt",
                "Europe",
                "Fantasy",
                "Healthcare",
                "Historical",
                "Horror",
                "Industrial Age",
                "Interwar",
                "Japan",
                "LGBTQ",
                "Lovecraftian",
                "Medieval",
                "Middle East",
                "North America",
                "Oceania",
                "Piracy",
                "Post-apocalyptic",
                "Pre-Columbian Americas",
                "Prehistoric",
                "Renaissance",
                "Romance",
                "Sci-fi",
                "South America",
                "Space",
                "Steampunk",
                "Supernatural",
                "Victorian",
                "Western",
                "World War I",
                "World War II",
                "Zombies",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortCheckbox: false,
            sortAlphabetical: true,
            table: "Infobox_game",
            column: "Themes",
            isList: true
        }),
        sports: filter({
            title: "Sports",
            options: options(
                "American football",
                "Australian football",
                "Baseball",
                "Basketball",
                "Bowling",
                "Boxing",
                "Cricket",
                "Darts/target shooting",
                "Dodgeball",
                "Extreme sports",
                "Fictional sport",
                "Fishing",
                "Football (Soccer)",
                "Golf",
                "Handball",
                "Hockey",
                "Horse",
                "Lacrosse",
                "Martial arts",
                "Mixed sports",
                "Paintball",
                "Parachuting",
                "Pool rr snooker",
                "Racquetball/squash",
                "Rugby",
                "Sailing/boating",
                "Skateboarding",
                "Skating",
                "Snowboarding or skiing",
                "Surfing",
                "Table tennis",
                "Tennis",
                "Volleyball",
                "Water sports",
                "Wrestling",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortCheckbox: false,
            sortAlphabetical: true,
            table: "Infobox_game",
            column: "Sports",
            isList: true
        }),
        vehicles: filter({
            title: "Vehicles",
            options: options(
                "Automobile",
                "Bicycle",
                "Bus",
                "Flight",
                "Helicopter",
                "Hovercraft",
                "Industrial",
                "Motorcycle",
                "Naval/watercraft",
                "Off-roading",
                "Robot",
                "Self-propelled artillery",
                "Space flight",
                "Street racing",
                "Tank",
                "Track racing",
                "Train",
                "Transport",
                "Truck",
            ),
            valueFilter: true,
            andCheckbox: true,
            and: false,
            sortCheckbox: false,
            sortAlphabetical: true,
            table: "Infobox_game",
            column: "Vehicles",
            isList: true
        }),
        license: filter({
            title: "License",
            options: options(
                "commercial",
                "former commercial",
                "freeware",
                "free-to-play",
                "shareware"
            ),
            valueFilter: false,
            andCheckbox: true,
            and: false,
            sortCheckbox: false,
            sortAlphabetical: false,
            table: "Infobox_game",
            column: "License"
        })
    };
    return defaultFilters;
};

export type BrowseFilters = ReturnType<typeof getDefaultFilters>;

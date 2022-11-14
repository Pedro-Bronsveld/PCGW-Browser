import { anyOptionsEnabled } from "@/browse/filter-options-util";
import type { Filter } from "@/models/browse/filter";
import type { SearchGamesOptions } from "@/models/browse/search-games-options";
import type { CargoQueryError, CargoQueryResponse } from "@/models/cargo/cargo-query-response";
import { getKeys } from "@/utilities/objet-utils";
import { createCargoQueryParams, createFieldsString, createPropColumnMap, createWhereString, filterToWhereString } from "./cargo-util";
import { setUrlQueryParams } from "./url-util";

export default class PCGWApi {
    private base: string = "https://www.pcgamingwiki.com";
    private basePath: string = "w/api.php"
    
    private get baseUrl(): URL {
        return new URL(this.basePath, this.base);
    }

    public async searchGames(options: SearchGamesOptions) {

        const { inTitle, filters } = options;
        
        const gamePropColumnMap = createPropColumnMap("Infobox_game", {
            pageId: "_pageID",
            page: "_pageName",
            coverUrl: "Cover_URL",
            genres: "Genres",
            steamId: "Steam_AppID",
            gogId: "GOGcom_ID",
            releaseDate: "Released"
        });

        const l10nPropColumnMap = createPropColumnMap("L10n", {
            language: "Language"
        });

        const anyLanguageOptionsEnabled = anyOptionsEnabled(filters.languages);

        const querriedTables = [...new Set(
            ["Infobox_game"].concat(
                Object.values(filters)
                .filter(anyOptionsEnabled)
                .map(filter => filter.table))
            )];
        
        const params = createCargoQueryParams({
            origin: "*", 
            action: "cargoquery",
            tables: querriedTables.join(","),
            ...(querriedTables.length > 1 ? {
                join_on: querriedTables
                    .filter(table => table !== "Infobox_game")
                    .map(table => `Infobox_game._pageID=${table}._pageID`)
                    .join(","),
            } : {}),
            fields: [createFieldsString(gamePropColumnMap)]
                .concat(anyLanguageOptionsEnabled ? [createFieldsString(l10nPropColumnMap)] : [])
                .join(","),
            where: getKeys(filters)
                .map(key => filters[key])
                .filter(anyOptionsEnabled)
                .map(filter => `(${filterToWhereString(filter as unknown as Filter<(typeof filters)[keyof typeof filters]["table"]>)})`)
                .concat(inTitle !== "" ? [createWhereString("Infobox_game", `_pageName LIKE '%${inTitle}%'`)] : [])
                .join(" AND "),
            limit: `${options.limit}`,
            ...(options.offset !== undefined && options.offset !== 0 ? {
                offset: `${options.offset}`
            } : {}),
            format: "json"
        });

        console.log("params:", params)

        const searchUrl = setUrlQueryParams(this.baseUrl, new URLSearchParams(params));

        // Start measuring query time
        const startTime = performance.now();

        const response: CargoQueryResponse<{
            tableName: typeof gamePropColumnMap.tableName | typeof l10nPropColumnMap.tableName,
            props: typeof gamePropColumnMap.props & Partial<typeof l10nPropColumnMap.props>
        }> | CargoQueryError = await fetch(searchUrl, {
            method: "GET",
            cache: "force-cache",
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            }
        }).then(r => r.json());

        // End measuring query time
        const endTime = performance.now();
        console.log(`Games query took ${Math.round((endTime - startTime) * 100) / 100} milliseconds`);

        console.log("response:", response);
        if ("error" in response)
            throw response;
        else if (response.warnings !== undefined)
            console.warn("Warning in api response:", response.warnings);

        const games = response.cargoquery.map(({ title }) => title);
        console.log("games:", games);
        return games;
    }

    public pageToUrl(page: string): string {
        return `${this.base}/wiki/${page.replace(/ /g, "_")}`
    }

}

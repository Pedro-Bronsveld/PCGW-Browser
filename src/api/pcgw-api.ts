import { anyOptionsEnabled } from "@/browse/filter-options-util";
import type { BrowseFilters } from "@/constants/default-filters";
import type { Filter } from "@/models/browse/filter";
import type { SearchGamesOptions } from "@/models/browse/search-games-options";
import type { CargoQueryError, CargoQueryResponse } from "@/models/cargo/cargo-query-response";
import type { Tables } from "@/models/tables/tables";
import { getKeys } from "@/utilities/objet-utils";
import { createCargoQueryParams, createFieldsString, createPropColumnMap, createWhereString, filterToWhereString, languageSupportWhereString } from "./cargo-util";
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
            genres: "Genres",
            steamId: "Steam_AppID",
            gogId: "GOGcom_ID",
            releaseDate: "Released"
        });

        const l10nPropColumnMap = createPropColumnMap("L10n", {
            language: "Language"
        });

        const anyLanguageOptionsEnabled = anyOptionsEnabled(filters.languages);
        
        const params = createCargoQueryParams({
            origin: "*", 
            action: "cargoquery",
            tables: [...new Set(
                ["Infobox_game"].concat(
                    Object.values(filters)
                    .filter(anyOptionsEnabled)
                    .map(filter => filter.table))
                )].join(","),
            ...(anyLanguageOptionsEnabled ? {
                join_on: "Infobox_game._pageID=L10n._pageID",
            } : {}),
            fields: [createFieldsString(gamePropColumnMap)]
                .concat(anyLanguageOptionsEnabled ? [createFieldsString(l10nPropColumnMap)] : [])
                .join(","),
            where: getKeys(filters)
                .map(key => filters[key])
                .filter(filter => filter.table === "Infobox_game" || filter.table === "L10n" && filter.column === "Language")
                .filter(anyOptionsEnabled)
                .map(filter => `(${filterToWhereString(filter as unknown as Filter<(typeof filters)[keyof typeof filters]["table"]>)})`)
                .concat(inTitle !== "" ? [createWhereString("Infobox_game", `_pageName LIKE '%${inTitle}%'`)] : [])
                .concat(anyLanguageOptionsEnabled && anyOptionsEnabled(filters.languageSupport) ? 
                    `(${languageSupportWhereString(filters.languageSupport)})` : [])
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

        const response: CargoQueryResponse<typeof gamePropColumnMap> | CargoQueryError = await fetch(searchUrl, {
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

}

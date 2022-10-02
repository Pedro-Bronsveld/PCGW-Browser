import { anyOptionsEnabled } from "@/browse/filter-options-util";
import type { getDefaultFilters } from "@/constants/default-filters";
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

    public async searchGames(title: string, filters: ReturnType<typeof getDefaultFilters>) {
        
        const propColumnMap = createPropColumnMap("Infobox_game", {
            page: "_pageName",
            genres: "Genres",
            steamId: "Steam_AppID",
            gogId: "GOGcom_ID",
            releaseDate: "Released"
        });
        
        const params = createCargoQueryParams({
            origin: "*", 
            action: "cargoquery",
            tables: "Infobox_game",
            fields: createFieldsString(propColumnMap),
            where: getKeys(filters)
                .map(key => filters[key])
                .filter(anyOptionsEnabled)
                .map(filter => `(${filterToWhereString(filter)})`)
                .concat(title !== "" ? [createWhereString(`Infobox_game._pageName LIKE '%${title}%'`)] : [])
                .join(" AND "),
            limit: "5",
            format: "json"
        });

        console.log("params:", params)

        const searchUrl = setUrlQueryParams(this.baseUrl, new URLSearchParams(params));

        // Start measuring query time
        const startTime = performance.now();

        const response: CargoQueryResponse<typeof propColumnMap> | CargoQueryError = await fetch(searchUrl, {
            method: "GET",
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

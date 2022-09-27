import { createCargoQueryParams, createFieldsString, createPropColumnMap } from "./cargo-util";
import { setUrlQueryParams } from "./url-util";

export default class PCGWApi {
    private base: string = "https://www.pcgamingwiki.com";
    private basePath: string = "w/api.php"
    
    private get baseUrl(): URL {
        return new URL(this.basePath, this.base);
    }

    public async searchGames() {

        const propColumnMap = createPropColumnMap("Infobox_game", {
            page: "_pageName",
            steamId: "Steam_AppID",
            gogId: "GOGcom_ID",
            releaseDate: "Released"
        })

        const params = createCargoQueryParams({
            origin: "*", 
            action: "cargoquery",
            tables: "Infobox_game",
            fields: createFieldsString(propColumnMap),
            limit: "5",
            format: "json"
        });

        const searchUrl = setUrlQueryParams(this.baseUrl, new URLSearchParams(params));

        const response = await fetch(searchUrl, {
            method: "GET",
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            }
        });

        const json: { [Key in keyof typeof propColumnMap.props]: string } = await response.json();

        console.log(json);
        return response;
    }

}

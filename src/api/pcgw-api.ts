import { setUrlQueryParams } from "./url-util";

export default class PCGWApi {
    private base: string = "https://www.pcgamingwiki.com";
    private basePath: string = "w/api.php"
    
    private get baseUrl(): URL {
        return new URL(this.basePath, this.base);
    }

    public async searchGames() {
        const searchUrl = setUrlQueryParams(this.baseUrl, new URLSearchParams({
            origin: "*",
            action: "cargoquery",
            tables: "Infobox_game",
            fields: "Infobox_game._pageName=Page,Infobox_game.Developers,Infobox_game.Released,Infobox_game.Cover_URL",
            limit: "5",
            format: "json"
        }));

        const response = await fetch(searchUrl, {
            method: "GET",
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            }
        });
        const json = await response.json();
        console.log(json);
        return response;
    }

}

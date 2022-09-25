import { createFieldsString, createPropColumnMap } from "@/api/cargo-util";
import { test, it, expect, describe } from "vitest";

describe("Cargo Utilities", () => {

    test("create fields string", () => {
        const fieldsString = createFieldsString(
            createPropColumnMap("Infobox_game", {
                    page: "_pageName",
                    genres: "Genres"
                }
            )
        );
        expect(fieldsString).toContain("=page");
        expect(fieldsString).toEqual("Infobox_game._pageName=page,Infobox_game.Genres=genres");
    });
    
});

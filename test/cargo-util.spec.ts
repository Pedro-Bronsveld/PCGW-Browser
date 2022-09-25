import { createFieldsString } from "@/api/cargo-util";
import { test, it, expect, describe } from "vitest";

describe("Cargo Utilities", () => {

    test("create fields string", () => {
        const fieldsString = createFieldsString({
            tableName: "Infobox_game",
            columnMappings: {
                _pageName: "page",
                Genres: "genres"
            }
        });
        expect(fieldsString).toContain("=page");
    });
    
});

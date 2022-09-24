import { it, expect, describe } from "vitest";
import PCGWApi from "@/api/pcgw-api";

describe("PCGW Api", () => {

    it("can be created", () => {
        const pcgwApi = new PCGWApi();
        expect(pcgwApi).toBeDefined();
    });

});

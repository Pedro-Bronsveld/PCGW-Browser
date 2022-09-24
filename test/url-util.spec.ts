import { setUrlQueryParams } from "@/api/url-util";
import { test, expect } from "vitest";

test("Can add query params from object to a URL", () => {
    const url = new URL("path", "https://example.org");
    const params = new URLSearchParams({
        param1: "value1",
        param2: "value2"
    });
    const urlWithParams = setUrlQueryParams(url, params);

    expect(urlWithParams.searchParams.toString()).toEqual(params.toString());
});

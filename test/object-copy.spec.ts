import { deepCopyObject } from "@/utilities/object-utils";
import { describe, it, expect } from "vitest";

describe("Deep object copy", () => {

    it("creates a deep copy of an object", () => {
        const sourceObject = {
            one: "one",
            two: 2,
            three: true,
            four: {
                someProp: "hello, world"
            },
            five: new Map([["one", 1],["two", 2],["three", 3]])
        }

        const expectedCopy = {
            one: "one",
            two: 2,
            three: true,
            four: {
                someProp: "hello, world"
            },
            five: new Map([["one", 1],["two", 2],["three", 3]])
        }

        const objectCopy = deepCopyObject(sourceObject);

        expect(objectCopy).toEqual(expectedCopy);
        expect(objectCopy).not.toBe(sourceObject);
        
    });
    
});

import { objectsEqual } from "@/utilities/object-utils";
import { describe, it, expect } from "vitest";

describe("Objects Equal", () => {

    it("can compare two objects.", () => {
        const objA = {
            one: "one",
            two: 2,
            three: true,
            four: {
                someProp: "hello, world"
            }
        }

        const objB = {
            one: "one",
            two: 2,
            three: true,
            four: {
                someProp: "hello, world"
            }
        }

        const objC = {
            one: "one",
            two: 2,
            three: true,
            four: {
                someProp: "hello"
            }
        }
        
        const deepEquality1 = objectsEqual(objA, objB);
        expect(deepEquality1).toBe(true);

        const deepEquality2 = objectsEqual(objA, objC);
        expect(deepEquality2).toBe(false);

        const simpleEquality = objectsEqual(objA, objC, false);
        expect(simpleEquality).toBe(true);
    });

});

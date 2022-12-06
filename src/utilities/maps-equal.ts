import { objectsEqual } from "./object-utils";

export const mapsEqual = <M extends Map<any, any>>(mapA: M, mapB: M): boolean => {
    if (mapA.size !== mapB.size)
        return false;
    
    for (const [key, valueA] of mapA) {
        if (!mapB.has(key))
            return false;
        
        const valueB = mapB.get(key);

        if (typeof valueA !== typeof valueB)
            return false;
        
        if (typeof valueA === "object") {
            if (valueA instanceof Map && valueB instanceof Map) {
                const nestedEquality = mapsEqual(valueA, valueB);
                if (!nestedEquality)
                    return false;
            }
            else {
                const nestedEquality = objectsEqual(valueA, valueB);
                if (!nestedEquality)
                    return false;
            }
        }
        else {
            if (valueA !== valueB)
                return false;
        }
    }

    return true;
}

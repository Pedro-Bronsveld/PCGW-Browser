/**
 * Returns a list of all the properties in for a given object
 * in a type safe way.
 * This function basically wraps `Object.keys` and retains
 * the type information of its keys.
 * @param object from which the keys will be returned.
 * @returns a list of strings of all the properties on `object`.
 */
export const getKeys = <Obj extends Object>(object: Obj): (keyof Obj)[] => Object.keys(object) as Array<keyof Obj>

export const fromEntries = <K extends string | symbol | number, V>(entries: Iterable<readonly [K, V]>): Record<K, V> => 
    Object.fromEntries(entries) as Record<K, V>

export const objectsEqual = (objA: Record<string, any>, objB: Record<string, any>, deep: boolean = true): boolean => {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    // Check if both objects have the same number of keys.
    // If they don't, the two objects can't be equal.
    if (keysA.length !== keysB.length)
        return false;
    
    for (const key in objA) {
        if (typeof objA[key] !== typeof objB[key])
            return false;

        if (deep && typeof objA[key] === "object") {
            const nestedEqual = objectsEqual(objA[key], objB[key], deep);
            if (!nestedEqual)
                return false;
        }
        else if (typeof objA[key] !== "object") {
            // Check if the values of the given key are equal in
            // both objects.
            if (objA[key] !== objB[key])
                return false;
        }
    }

    return true;
}

export const deepCopyObject = <Obj extends Object>(obj: Obj): Obj => {
    const objCopy = { ...obj };
    
    getKeys(objCopy)
    .filter(key => typeof objCopy[key] === "object")
    .forEach(key => {
        const nestedValue = objCopy[key];
        objCopy[key] = deepCopyObject(nestedValue as typeof nestedValue & Object);
    });
    
    return objCopy;
}

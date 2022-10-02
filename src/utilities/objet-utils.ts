/**
 * Returns a list of all the properties in for a given object
 * in a type safe way.
 * This function basically wraps `Object.keys` and retains
 * the type information of its keys.
 * @param object from which the keys will be returned.
 * @returns a list of strings of all the properties on `object`.
 */
export const getKeys = <Obj extends Object>(object: Obj): (keyof Obj)[] => Object.keys(object) as Array<keyof Obj>

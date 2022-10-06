type KeysMatchingType<Obj extends Object, MatchValueType> = {
    [K in keyof Obj]: Obj[K] extends MatchValueType ? K : never;
}[keyof Obj]

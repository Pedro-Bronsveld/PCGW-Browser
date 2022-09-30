export type Column<
    T extends number | string | boolean | Date | number[] | string[] | boolean[] | Date[] = string,
    D extends (T extends any[] ? string : never) = (T extends any[] ? "," : never),
    Nullable extends boolean = true
    > = (T extends any[] ? {
        delimiter: D
    } : {}) & {
        type: T,
        nullable: Nullable
    }

export type GenericColumn = Column<any, any, boolean>;

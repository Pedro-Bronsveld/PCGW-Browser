export type Filter = {
    title: string;
    options: Map<number, FilterOption>;
    valueFilter: boolean;
    andCheckbox: boolean;
    and: boolean;
    sortAlphabetical: boolean;
    sortCheckbox: boolean;
};

export type FilterOption = {
    number: number,
    value: string;
    enabled: boolean;
}

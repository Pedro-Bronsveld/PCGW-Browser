export interface CargoQueryResponse<ResultKeys extends string> {
    cargoquery: {
        title: {
            [Key in ResultKeys]: string
        }
    }[];
}

import type { Column } from "./column";

export interface GenericTableStructure extends Record<string, Column<any, string>> {}

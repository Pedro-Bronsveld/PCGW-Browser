import { PCGW_BASE } from "@/constants/base";

export const gamePageToUrl = (page: string) =>
    `${PCGW_BASE}/wiki/${page.replace(/ /g, "_")}`

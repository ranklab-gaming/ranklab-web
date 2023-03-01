import { Configuration, RanklabApi } from "@ranklab/api"

export const api = new RanklabApi(new Configuration({ basePath: "/api" }))

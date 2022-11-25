import { RanklabApi, Configuration } from "@ranklab/api"
import { baseConfiguration } from "../api"

export default new RanklabApi(
  new Configuration({ ...baseConfiguration, basePath: "/api" })
)

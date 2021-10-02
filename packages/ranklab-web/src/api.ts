import { Game, RanklabApi } from "@ranklab/api"

export function gameFromString(str: string): Game {
  switch (str) {
    case "overwatch":
      return Game.Overwatch
    case "chess":
      return Game.Chess
    default:
      throw new Error("Invalid game string")
  }
}

export default new RanklabApi({ basePath: "/api" })

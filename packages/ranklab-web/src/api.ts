import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Game, RanklabApi, RanklabApiFactory } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"
import * as isomorphicFetch from "isomorphic-fetch"

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

export default {
  client: new RanklabApi({ basePath: "/api" }),
  server: (ctx: GetServerSidePropsContext) => {
    const session = getSession(ctx.req, ctx.res)

    return RanklabApiFactory(
      {},
      function (url, options = {}) {
        const headers = options.headers || {}

        return fetch(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${session?.idToken}`,
            ...headers,
          },
        })
      },
      process.env.API_HOST
    )
  },
}

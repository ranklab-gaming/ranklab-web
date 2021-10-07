import { getSession } from "@auth0/nextjs-auth0"
import { RanklabApi, RanklabApiFactory } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"

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

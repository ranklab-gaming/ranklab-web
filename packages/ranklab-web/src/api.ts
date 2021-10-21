import { getSession } from "@auth0/nextjs-auth0"
import { RanklabApi, RanklabApiFactory } from "@ranklab/api"
import humps from "humps"
import { GetServerSidePropsContext } from "next"

export default {
  client: new RanklabApi({ basePath: "/api" }),
  server: (ctx: GetServerSidePropsContext) => {
    const session = getSession(ctx.req, ctx.res)

    return RanklabApiFactory(
      {},
      async function (url, options = {}) {
        const headers = options.headers || {}

        const response = await fetch(url, {
          ...options,
          body: options.body
            ? JSON.stringify(humps.decamelizeKeys(JSON.parse(options.body)))
            : undefined,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            ...headers,
          },
        })

        const json = await response.json()

        return new Response(JSON.stringify(humps.camelizeKeys(json)), {
          headers: {
            "Content-Type": "application/json",
          },
        })
      },
      process.env.API_HOST
    )
  },
}

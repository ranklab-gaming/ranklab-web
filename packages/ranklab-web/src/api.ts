import { getSession } from "@auth0/nextjs-auth0"
import { RanklabApi, Configuration } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"
import "isomorphic-fetch"

export default {
  client: new RanklabApi(new Configuration({ basePath: "/api" })),
  server: (ctx: GetServerSidePropsContext) => {
    const session = getSession(ctx.req, ctx.res)

    const configuration = new Configuration({
      fetchApi: fetch,
      basePath: process.env.API_HOST,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    return new RanklabApi(configuration)
  },
}

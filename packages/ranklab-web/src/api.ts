import { getSession } from "@auth0/nextjs-auth0"
import {
  RanklabApi,
  Configuration,
  ResponseContext,
  RequestContext,
} from "@ranklab/api"
import { GetServerSidePropsContext } from "next"
import "isomorphic-fetch"
import { camelCase, transform, isArray, isObject, snakeCase } from "lodash"

function camelize(json: Record<string, any>) {
  return transform<any, Record<string, any>>(
    json,
    (acc, value, key, target) => {
      const newKey = isArray(target) ? key : camelCase(key)
      acc[newKey] = isObject(value) ? camelize(value) : value
    }
  )
}

function decamelize(json: Record<string, any>) {
  return transform<any, Record<string, any>>(
    json,
    (acc, value, key, target) => {
      const newKey = isArray(target) ? key : snakeCase(key)
      acc[newKey] = isObject(value) ? decamelize(value) : value
    }
  )
}

const baseConfiguration = {
  middleware: [
    {
      async post(context: ResponseContext) {
        const json = await context.response.json()

        return new Response(JSON.stringify(camelize(json)), {
          headers: context.response.headers,
          status: context.response.status,
          statusText: context.response.statusText,
        })
      },
      async pre(context: RequestContext) {
        if (typeof context.init.body === "string") {
          const json = JSON.parse(context.init.body)
          context.init.body = JSON.stringify(decamelize(json))
        }
      },
    },
  ],
}

export default {
  client: new RanklabApi(
    new Configuration({ ...baseConfiguration, basePath: "/api" })
  ),
  server: (ctx: GetServerSidePropsContext) => {
    const session = getSession(ctx.req, ctx.res)

    const configuration = new Configuration({
      ...baseConfiguration,
      fetchApi: fetch,
      basePath: process.env.API_HOST,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    return new RanklabApi(configuration)
  },
}

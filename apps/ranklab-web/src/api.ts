import {
  RanklabApi,
  Configuration,
  ResponseContext,
  RequestContext,
} from "@ranklab/api"
import { GetServerSidePropsContext } from "next"
import "isomorphic-fetch"
import { camelCase, transform, isArray, isObject, snakeCase } from "lodash"
import { getAccessToken } from "./utils/getAccessToken"

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
        try {
          const json = await context.response.clone().json()

          return new Response(JSON.stringify(camelize(json)), {
            headers: context.response.headers,
            status: context.response.status,
            statusText: context.response.statusText,
          })
        } catch (e) {
          if (e instanceof SyntaxError) {
            return context.response
          }

          throw e
        }
      },
      async pre(context: RequestContext) {
        if (typeof context.init.body === "string") {
          try {
            const json = JSON.parse(context.init.body)
            context.init.body = JSON.stringify(decamelize(json))
          } catch (e) {
            if (e instanceof SyntaxError) {
              return
            }

            throw e
          }
        }
      },
    },
  ],
}

export default {
  client: new RanklabApi(
    new Configuration({ ...baseConfiguration, basePath: "/api" })
  ),
  server: async ({
    req,
    res,
  }: Pick<GetServerSidePropsContext, "req" | "res">) => {
    const { accessToken } = await getAccessToken(req, res)

    const configuration = new Configuration({
      ...baseConfiguration,
      fetchApi: fetch,
      basePath: process.env.API_HOST,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return new RanklabApi(configuration)
  },
}

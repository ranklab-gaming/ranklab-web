import { apiHost } from "@/config/server"
import {
  Configuration,
  InitOverrideFunction,
  RanklabApi,
  RequestOpts,
} from "@ranklab/api"
import { camelCase, isArray, isObject, snakeCase, transform } from "lodash"
import { GetServerSidePropsContext } from "next"
import { getServerSession } from "@/auth/session"
import AWSXRay from "aws-xray-sdk"

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

export class ServerApi extends RanklabApi {
  constructor(apiKey?: string) {
    const configuration = new Configuration({
      apiKey,
      basePath: apiHost,
      async fetchApi(input, init) {
        return AWSXRay.captureAsyncFunc(apiHost, async (subsegment) => {
          try {
            const response = await fetch(input, init)

            subsegment?.addAttribute("http", {
              request: {
                method: init?.method,
                url: input,
              },
              response: {
                status: response.status,
                content_length: response.headers.get("content-length"),
              },
            })

            subsegment?.close()
            return response
          } catch (error) {
            subsegment?.close(error as any)
            throw error
          }
        })
      },
      middleware: [
        {
          post: async ({ response }) => {
            const json = await response.clone().json()

            return new Response(JSON.stringify(camelize(json)), {
              headers: response.headers,
              status: response.status,
              statusText: response.statusText,
            })
          },
          pre: async ({ init, url: rawUrl }) => {
            const apiKey = this.configuration.apiKey?.("jwt")

            const headers = {
              ...init.headers,
              "content-type": "application/json",
              accept: "application/json",
              ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
            }

            let body: BodyInit | null | undefined

            if (typeof init.body === "string") {
              const json = JSON.parse(init.body)
              body = JSON.stringify(decamelize(json))
            } else {
              body = init.body
            }

            const queryString: string = rawUrl.split("?")[1] ?? ""
            const query = new URLSearchParams(queryString)
            const serializedQuery = new URLSearchParams()

            for (const [key, value] of query) {
              const matches = key.match(/^(.+)\[(.+)\]$/)

              if (matches) {
                const scope = snakeCase(matches[1])
                const key = snakeCase(matches[2])

                serializedQuery.append(`${scope}.${key}`, value)
              } else {
                serializedQuery.append(snakeCase(key), value)
              }
            }

            const url =
              queryString.length > 0
                ? `${rawUrl.split("?")[0]}?${serializedQuery.toString()}`
                : rawUrl

            return {
              init: {
                ...init,
                headers,
                body,
              },
              url,
            }
          },
        },
      ],
    })

    super(configuration)
  }

  async request(
    context: RequestOpts,
    initOverrides?: RequestInit | InitOverrideFunction
  ): Promise<Response> {
    return super.request(context, initOverrides)
  }
}

export async function createServerApi(req: GetServerSidePropsContext["req"]) {
  const session = await getServerSession(req)
  return new ServerApi(session?.accessToken)
}

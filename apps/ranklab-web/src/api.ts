import { ResponseContext, RequestContext } from "@ranklab/api"
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

export const baseConfiguration = {
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
        console.log("in pre bro")
        debugger
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

        const url = new URL(context.url)

        url.searchParams.forEach((value, key) => {
          url.searchParams.delete(key)
          url.searchParams.append(snakeCase(key), value)
        })

        console.log(url.toString())

        return {
          init: context.init,
          url: url.toString(),
        }
      },
    },
  ],
}

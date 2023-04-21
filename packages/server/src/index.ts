import express from "express"
import xrayExpress from "aws-xray-sdk-express"
import AWSXRay from "aws-xray-sdk"
import next = require("next")
import nextEnv from "@next/env"
import pino = require("pino-http")
import type { Options as PinoOptions } from "pino-http"

const { loadEnvConfig } = nextEnv

export default async () => {
  const dev = process.env.NODE_ENV !== "production"

  loadEnvConfig("./", dev)

  const { port, host } = await import("./config.js")
  const { hostname } = host
  const { getOidcProvider } = await import("./oidc/provider.js")

  let pinoOptions: PinoOptions = {
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        headers: Object.entries(req.headers).reduce(
          (acc, [key, value]) =>
            key === "cookie" ? acc : { ...acc, [key]: value },
          {}
        ),
      }),
    },
    ...(dev
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          },
        }
      : {}),
  }

  AWSXRay.middleware.enableDynamicNaming()

  const nextApp = next.default({
    hostname,
    port,
    dev,
  })

  await nextApp.prepare()

  const app = express()
  const nextHandler = nextApp.getRequestHandler()
  const oidcProvider = await getOidcProvider()

  if (!dev) {
    oidcProvider.proxy = true
  }

  app.use(pino.default(pinoOptions))
  app.use(xrayExpress.openSegment("ranklab-web"))
  app.use("/oidc", oidcProvider.callback())

  app.get("/r/:id", (req, res) => {
    res.redirect(307, `/api/r/${req.params.id}`)
  })

  app.all("*", async (req, res) => {
    try {
      await nextHandler(req, res)
    } catch (err) {
      console.error(err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })

  app.use(xrayExpress.closeSegment())

  app.listen(port, () => {
    console.log("Listening on port", port, "url: " + host.origin)
  })
}

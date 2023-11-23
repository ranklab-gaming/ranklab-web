import express from "express"
import xrayExpress from "aws-xray-sdk-express"
import AWSXRay from "aws-xray-sdk"
import * as next from "next"
import nextEnv from "@next/env"
import pino = require("pino-http")
import type { Options as PinoOptions } from "pino-http"
import * as fs from "fs"
import * as https from "https"

const { loadEnvConfig } = nextEnv

export default async () => {
  const dev = process.env.NODE_ENV !== "production"

  loadEnvConfig("./", dev)

  const { port, host, logLevel } = await import("./config.js")
  const { hostname } = host
  const { getOidcProvider } = await import("./oidc/provider.js")
  const localHttps = dev && host.protocol === "https:"

  const pinoOptions: PinoOptions = {
    level: logLevel,
    autoLogging: {
      ignore: (req) => Boolean(req.url?.startsWith("/_next") || req.url?.startsWith("/__next") || req.url?.startsWith("/favicon")),
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers,
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

  let server: express.Express | https.Server = app

  if (localHttps) {
    const options = {
      key: fs.readFileSync(".certs/key.pem"),
      cert: fs.readFileSync(".certs/cert.pem"),
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = localHttps ? "0" : "1"
    server = https.createServer(options, app)
  }

  server.listen(port, () => {
    console.log("Listening on port", port, "url: " + host.origin)
  })
}

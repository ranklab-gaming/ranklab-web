const oidc = import("./oidc/provider.mjs")
const express = require("express")
const xrayExpress = require("aws-xray-sdk-express")
const AWSXRay = require("aws-xray-sdk")
const next = require("next")
const { loadEnvConfig } = require("@next/env")
const dev = process.env.NODE_ENV !== "production"
const pino = require("pino-http")

let logger = {
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
}

if (dev) {
  logger = {
    ...logger,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }
}

process.chdir(__dirname)
loadEnvConfig("./", dev)

if (!process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on("SIGTERM", () => process.exit(0))
  process.on("SIGINT", () => process.exit(0))
}

AWSXRay.middleware.enableDynamicNaming()

const port = parseInt(process.env.PORT, 10) || 3000
const webHost = new URL(process.env.WEB_HOST || "http://localhost:3000")
const hostname = webHost.hostname

const nextApp = next({
  hostname,
  port,
  dev,
})

oidc.then(({ getOidcProvider }) => {
  nextApp.prepare().then(() => {
    const app = express()
    const nextHandler = nextApp.getRequestHandler()
    const oidcProvider = getOidcProvider()

    if (!dev) {
      oidcProvider.proxy = true
    }

    app.use(pino(logger))
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

    app.listen(port, (err) => {
      if (err) {
        console.error("Failed to start server", err)
        process.exit(1)
      }

      console.log(
        "Listening on port",
        port,
        "url: http://" + hostname + ":" + port
      )
    })
  })
})

const oidc = import("./oidc/provider.mjs")
const express = require("express")
const xrayExpress = require("aws-xray-sdk-express")
const AWSXRay = require("aws-xray-sdk")
const next = require("next")
const { loadEnvConfig } = require("@next/env")
const dev = process.env.NODE_ENV !== "production"

loadEnvConfig("./", dev)
process.chdir(__dirname)

if (!process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on("SIGTERM", () => process.exit(0))
  process.on("SIGINT", () => process.exit(0))
}


AWSXRay.setContextMissingStrategy("IGNORE_ERROR")
AWSXRay.captureHTTPsGlobal(require("http"))
AWSXRay.captureHTTPsGlobal(require("https"))

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

    app.use(xrayExpress.openSegment("ranklab-web"))
    app.use("/oidc", getOidcProvider().callback())

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

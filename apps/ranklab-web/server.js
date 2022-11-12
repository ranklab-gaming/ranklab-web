// server.js
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const express = require("express")
const { loadEnvConfig } = require("@next/env")
const dev = process.env.NODE_ENV !== "production"
loadEnvConfig("./", dev)
const provider = require("./oidc")
const hostname = new URL(process.env.WEB_HOST).hostname
const port = dev ? 3000 : 80
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

process.env.NEXTAUTH_URL = process.env.WEB_HOST

app.prepare().then(() => {
  const server = express()

  server.use(provider.callback())
  server.use(handle)

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

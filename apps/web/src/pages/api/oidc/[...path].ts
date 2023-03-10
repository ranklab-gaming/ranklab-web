import { nodeEnv } from "@/config/server"
import koa from "koa"
import mount from "koa-mount"
import { getOidcProvider } from "@/oidc"

const app = new koa()

if (nodeEnv === "production") {
  app.proxy = true
}

app.use(mount("/api/oidc", getOidcProvider().app))

export default app.callback()

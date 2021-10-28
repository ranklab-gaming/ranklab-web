const encrypt = require("cypress-nextjs-auth0/encrypt")
const { loadEnvConfig } = require("@next/env")

module.exports = (on, config) => {
  on("task", { encrypt })

  const projectDir = process.cwd()
  loadEnvConfig(projectDir)

  config.env.auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET
  config.env.auth0CookieSecret = process.env.AUTH0_SECRET
  config.env.auth0Audience = process.env.AUTH0_AUDIENCE
  config.env.auth0ClientId = process.env.AUTH0_CLIENT_ID
  config.env.auth0Scope = process.env.AUTH0_SCOPE

  return config
}

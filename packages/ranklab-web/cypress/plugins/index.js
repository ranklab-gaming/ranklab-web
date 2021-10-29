const encrypt = require("cypress-nextjs-auth0/encrypt")
const { loadEnvConfig } = require("@next/env")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

export default (on, config) => {
  on("task", {
    encrypt,
    "db:reset": async () => {
      const databaseUrl = process.env.DATABASE_URL

      await exec(
        `psql ${databaseUrl}/postgres -c 'DROP DATABASE app_test WITH(FORCE);'`
      )

      await exec(
        `psql ${databaseUrl}/postgres -c 'CREATE DATABASE app_test TEMPLATE app_test_template;'`
      )

      return null
    },
  })

  const projectDir = process.cwd()
  loadEnvConfig(projectDir)

  config.env.auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET
  config.env.auth0CookieSecret = process.env.AUTH0_SECRET
  config.env.auth0Audience = process.env.AUTH0_AUDIENCE
  config.env.auth0ClientId = process.env.AUTH0_CLIENT_ID
  config.env.auth0Scope = process.env.AUTH0_SCOPE

  return config
}

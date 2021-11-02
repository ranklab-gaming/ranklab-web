const encrypt = require("cypress-nextjs-auth0/encrypt")
const { loadEnvConfig } = require("@next/env")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

export default (on, config) => {
  on("task", {
    encrypt,
    "db:reset": async () => {
      await exec(`psql ${process.env.DATABASE_URL} -c "SELECT reset_db();"`)
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

  await exec(`pasql ${process.env.DATABASE_URL} -c "
  CREATE OR REPLACE FUNCTION reset_db() RETURNS void AS $$
  DECLARE
      statements CURSOR FOR
          SELECT tablename FROM pg_tables
          WHERE tableowner = 'postgres' AND schemaname = 'public';
  BEGIN
      FOR stmt IN statements LOOP
          EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
      END LOOP;
  END;
  $$ LANGUAGE plpgsql;
  "`)

  return config
}

const encrypt = require("cypress-nextjs-auth0/encrypt")
const { loadEnvConfig } = require("@next/env")
const { Client } = require("pg")

export default async (on, config) => {
  on("task", {
    encrypt,
    "db:reset": async () => {
      const client = new Client({ connectionString: process.env.DATABASE_URL })
      await client.connect()
      await client.query(`SELECT reset_db();`)
      await client.end()

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

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  await client.query(`
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
  `)
  await client.end()

  return config
}

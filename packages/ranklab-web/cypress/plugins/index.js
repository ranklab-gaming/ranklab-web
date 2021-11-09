const { loadEnvConfig } = require("@next/env")
const decrypt = require("./decrypt")
const { Client } = require("pg")

async function queryDb(query) {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  const result = await client.query(query)
  await client.end()

  return result.rows
}

module.exports = async (on, config) => {
  on("task", {
    "db:reset": async () => {
      return await queryDb(`SELECT reset_db();`)
    },
    "db:query": queryDb,
    decrypt,
  })

  const projectDir = process.cwd()
  loadEnvConfig(projectDir)

  config.env.auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET
  config.env.auth0Secret = process.env.AUTH0_SECRET
  config.env.auth0Audience = process.env.AUTH0_AUDIENCE
  config.env.auth0ClientId = process.env.AUTH0_CLIENT_ID
  config.env.auth0Scope = process.env.AUTH0_SCOPE
  config.env.s3Bucket = process.env.NEXT_PUBLIC_S3_BUCKET

  await queryDb(`
    CREATE OR REPLACE FUNCTION reset_db() RETURNS void AS $$
    DECLARE
        statements CURSOR FOR
            SELECT tablename FROM pg_tables
            WHERE tableowner = 'postgres' AND schemaname = 'public' AND tablename <> 'games';
    BEGIN
        FOR stmt IN statements LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
        END LOOP;
    END;
    $$ LANGUAGE plpgsql;
  `)

  return config
}

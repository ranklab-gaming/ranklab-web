const { loadEnvConfig } = require("@next/env")
const decrypt = require("./decrypt")
const { Client } = require("pg")
const path = require("path")
const projectDir = path.join(__dirname, "../../")

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

  loadEnvConfig(projectDir)

  config.env.cookieSecret = process.env.COOKIE_SECRET
  config.env.stripeAccountId = process.env.TEST_STRIPE_ACCOUNT_ID
  config.env.stripeCustomerId = process.env.TEST_STRIPE_CUSTOMER_ID

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

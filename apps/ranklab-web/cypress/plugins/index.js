const { Client } = require("pg")
const { SignJWT, importJWK } = require("jose")

async function queryDb(query) {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  const { rows } = await client.query(query)
  await client.end()
  return rows
}

async function signJwt({ token }) {
  const {
    keys: [key],
  } = JSON.parse(Buffer.from(process.env.OIDC_JWKS, "base64").toString("ascii"))

  return new SignJWT(token)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(await importJWK(key))
}

module.exports = async (on, config) => {
  on("task", {
    "db:reset": () => queryDb(`SELECT reset_db();`),
    "db:query": queryDb,
    "jwt:sign": signJwt,
  })

  await queryDb(
    `
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
    `
  )

  return config
}

import fs from "fs/promises"
import { Client } from "pg"

export const db = new Client({
  host: process.env.DB_HOST ?? "postgres",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: process.env.DB_NAME ?? "app_test",
})

export const executeSqlFile = async (filePath: string) => {
  const sql = await fs.readFile(filePath, "utf8")
  await db.query(sql)
}

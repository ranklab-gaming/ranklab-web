import { test, expect } from "@playwright/test"
import { Client } from "pg"
import fs from "fs/promises"
import { v4 as uuid } from "uuid"

const client = new Client({
  host: process.env.DB_HOST ?? "postgres",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "app_test",
})

const executeSqlFile = async (filePath: string) => {
  const sql = await fs.readFile(filePath, "utf8")
  await client.query(sql)
}

test.beforeEach(async () => {
  await client.connect()
  await executeSqlFile("tests/fixtures/resetData.sql")
  await executeSqlFile("tests/fixtures/seedData.sql")
})

test.afterEach(async () => {
  await client.end()
})

test("mvp", async ({ page }) => {
  const reviewerEmail = `reviewer+${uuid()}@example.com`
  const userEmail = `user+${uuid()}@example.com`

  await page.goto("http://ranklab-test:3000/api/auth/signin?&intent=signup")
  await page.getByLabel("Name").fill("Test Reviewer")
  await page.getByLabel("Email").fill(reviewerEmail)
  await page.getByLabel("Password").fill("testreviewer")
  await page.getByRole("button", { name: "Sign up" }).click()
  await page.getByTitle("Account").click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.getByRole("link", { name: "Get Started" }).first().click()
  await page.getByLabel("Name").fill("Test User")
  await page.getByLabel("Email").fill(userEmail)
  await page.getByLabel("Password").fill("testuser")
  await page.getByRole("button", { name: "Sign up" }).click()
  await page.getByRole("link", { name: "Submit your VOD" }).first().click()
  await page.getByRole("tab", { name: "Video File" }).click()
  await page
    .locator('[name="video"]')
    .setInputFiles("tests/fixtures/exampleVideo.mp4")
  await page.locator(".ql-editor").fill("some notes")
  await page.getByRole("button", { name: "Submit your VOD" }).click()
  await expect(page.getByText("VOD submitted successfully")).toBeVisible()
  await page.getByTitle("Account").click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.getByRole("link", { name: "Sign in" }).click()
  await page.getByLabel("Email").fill(reviewerEmail)
  await page.getByLabel("Password").fill("testreviewer")
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.getByRole("link", { name: "exampleVideo" }).click()
  await expect(page.getByText("some notes")).toBeVisible()
  await page.getByRole("button", { name: "Comment" }).click()
  await page.locator(".ql-editor").fill("Wow!")
  await page.getByRole("button", { name: "Save Comment" }).click()
  await page.getByTitle("Account").click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.getByRole("link", { name: "Sign in" }).click()
  await page.getByLabel("Email").fill(userEmail)
  await page.getByLabel("Password").fill("testuser")
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.getByRole("link", { name: "exampleVideo" }).click()
  await page.getByRole("button", { name: "00:00:00 Wow!" }).click()
})

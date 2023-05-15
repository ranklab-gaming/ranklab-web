import { test } from "@playwright/test"
import { Client } from "pg"
import fs from "fs/promises"
import { v4 as uuid } from "uuid"

// test 1

const client = new Client({
  host: "postgres",
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

const stripeSelector = 'iframe[title="undefined"]'
const stripePaymentSelector = 'iframe[title="Secure payment input frame"]'

test("mvp", async ({ page }) => {
  const coachEmail = `coach+${uuid()}@example.com`
  const playerEmail = `player+${uuid()}@example.com`

  await page.goto(
    "http://ranklab-test:3000/api/auth/signin?token=123456789&user_type=coach&intent=signup"
  )
  await page.getByRole("button", { name: "Game" }).click()
  await page.getByRole("option", { name: "Overwatch" }).click()
  await page.getByLabel("Name").fill("Test Coach")
  await page.getByLabel("Email").fill(coachEmail)
  await page.getByLabel("Password").fill("testcoach")
  await page
    .getByLabel("Bio")
    .fill("A very short bio that is long enough to at least pass validation")
  await page.getByLabel("Price").fill("12.34")
  await page.getByRole("button", { name: "Country" }).click()
  await page.getByRole("option", { name: "United Kingdom" }).click()
  await page.getByRole("button", { name: "Create Account" }).click()
  await page.getByRole("link", { name: "Start onboarding" }).click()
  await page.locator('[data-test="phone-help-text-test-mode"]').click()
  await page.locator('[data-test="phone-entry-submit"]').click()
  await page.locator('[data-test="test-mode-fill-button"]').click()
  await page.getByRole("button", { name: "Continue" }).click()
  await page.getByPlaceholder("First name").fill("Test")
  await page.getByPlaceholder("Last name").fill("Coach")
  await page.getByPlaceholder("DD").fill("14")
  await page.getByPlaceholder("MM").fill("03")
  await page.getByPlaceholder("YYYY").fill("1990")
  await page.locator('[data-test="bizrep-submit-button"]').click()
  await page.locator('[data-test="test-mode-fill-button"]').click()
  await page.locator('[data-test="requirements-index-done-button"]').click()
  await page.getByRole("button", { name: "T", exact: true }).click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.getByRole("link", { name: "Get Started" }).first().click()
  await page.getByRole("button", { name: "Game" }).click()
  await page.getByText("Overwatch").click()
  await page.getByRole("button", { name: "Skill Level Bronze" }).click()
  await page.getByRole("option", { name: "Platinum" }).click()
  await page.getByLabel("Name").fill("Test Player")
  await page.getByLabel("Email").fill(playerEmail)
  await page.getByLabel("Password").fill("testplayer")
  await page.getByRole("button", { name: "Sign up" }).click()
  await page.getByRole("link", { name: "Submit your VOD" }).click()
  await page.getByRole("button", { name: "Coach" }).click()
  await page.getByRole("option", { name: "Test Coach" }).click()
  await page.getByRole("button", { name: "Continue" }).click()
  await page
    .locator('[name="newRecordingVideo"]')
    .setInputFiles("tests/fixtures/exampleVideo.mp4")
  await page.locator(".ql-editor").fill("some notes")
  await page.getByRole("button", { name: "Continue" }).click()
  await page
    .frameLocator(stripeSelector)
    .getByPlaceholder("First and last name")
    .fill("Test Player")
  await page
    .frameLocator(stripeSelector)
    .getByRole("combobox", { name: "Country or region" })
    .selectOption("GB")
  await page
    .frameLocator(stripeSelector)
    .getByPlaceholder("Street address")
    .fill("Some street")
  await page
    .frameLocator(stripeSelector)
    .getByLabel("Town or city")
    .fill("London")
  await page
    .frameLocator(stripeSelector)
    .getByLabel("Postal code")
    .fill("NW31DE")
  await page.getByRole("button", { name: "Proceed to Checkout" }).click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("1234 1234 1234 1234")
    .fill("4242 4242 4242 42424")
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("MM / YY")
    .fill("11 / 26")
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("CVC")
    .fill("123")
  const postalCode = await page
    .frameLocator(stripePaymentSelector)
    .locator('[name="postalCode"]')
    .getAttribute("placeholder")
  await page
    .frameLocator(stripePaymentSelector)
    .locator('[name="postalCode"]')
    .fill(postalCode ?? "NW31DE")
  await page.getByLabel("Save this card for future purchases").check()
  await page.getByRole("button", { name: "Pay $12.34" }).click()
  await page.getByRole("button", { name: "T", exact: true }).click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.getByRole("button").nth(2).click()
  await page.getByRole("menuitem", { name: "Sign in as coach" }).click()
  await page.getByLabel("Email").fill(coachEmail)
  await page.getByLabel("Password").fill("testcoach")
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.getByRole("link", { name: "exampleVideo" }).click()
  await page.getByRole("button", { name: "Start Review" }).click()
  await page.getByRole("button", { name: "Comment" }).click()
  await page.locator(".ql-editor").fill("Wow!")
  await page.getByRole("button", { name: "Save Comment" }).click()
  await page.getByRole("button", { name: "Publish Review" }).click()
  await page.getByRole("button", { name: "Confirm" }).click()
  await page
    .getByRole("alert")
    .filter({ hasText: "Your review was published successfully." })
    .getByRole("button")
    .click()
  await page.getByRole("button", { name: "T", exact: true }).click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.getByLabel("Email").fill(playerEmail)
  await page.getByLabel("Password").fill("testplayer")
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.getByRole("link", { name: "exampleVideo" }).click()
  await page.getByRole("button", { name: "00:00:00 Wow!" }).click()
  await page.getByRole("button", { name: "ACCEPT REVIEW" }).click()
})

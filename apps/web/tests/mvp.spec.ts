import { test, expect } from "@playwright/test"
import { Client } from "pg"
import fs from "fs/promises"
import { v4 as uuid } from "uuid"

// PostgreSQL connection information
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
  // Connect to the PostgreSQL database
  await client.connect()

  // Execute the reset SQL script to clear the existing data
  await executeSqlFile("tests/fixtures/reset_data.sql")

  // Execute the SQL script to seed the data
  await executeSqlFile("tests/fixtures/seed_data.sql")
})

test.afterEach(async () => {
  // Disconnect from the PostgreSQL database
  await client.end()
})

const googleAutocompleteSelector =
  'iframe[title="Google autocomplete suggestions dropdown list"]'
const stripeSelector = 'iframe[title="undefined"]'
const stripePaymentSelector = 'iframe[title="Secure payment input frame"]'

test("mvp", async ({ page }) => {
  await page.goto(
    "http://ranklab-test:3000/api/auth/signin?token=123456789&user_type=coach&intent=signup"
  )

  // await page.goto("http://ranklab-test:3000/")
  // await page.locator('[data-test="hero-get-started-button"]').click()
  // await page.locator('[data-test="account-fields-game"]').click()
  // await page.locator('[data-test="game-select-overwatch"]').click()
  // await page.locator('[data-test="account-fields-skill-level"]').click()
  // await page.locator('[data-test="account-fields-skill-level-2"]').click()
  // await page.locator('[data-test="account-fields-name"]').click()
  // await page.locator('[data-test="account-fields-name"]').fill("Test Player")
  // await page
  //   .locator('[data-test="account-fields-email"]')
  //   .fill(`player+${uuid()}@example.com`)
  // await page.locator('[data-test="account-fields-password"]').fill("testplayer")
  // await page.locator('[data-test="signup-submit-button"]').click()
  // await page.locator('[data-test="dashboard-request-review-button"]').click()
  // await page.locator('[data-test="reviews-new-coach-field"]').click()
  // await page.locator('[data-test="coach-select-0"]').click()
  // await page.locator('[data-test="reviews-new-continue-button"]').click()
  // await page
  //   .locator('[data-test="reviews-new-recording-video-field"]')
  //   .setInputFiles("tests/fixtures/Big_Buck_Bunny_1080_10s_1MB.mp4")
  // await page.locator(".ql-editor").click()
  // await page.locator(".ql-editor").fill("some notes")
  // await page.locator('[data-test="reviews-new-continue-button"]').click()
  // await page
  //   .frameLocator(stripeSelector)
  //   .getByPlaceholder("First and last name")
  //   .click()
  // await page
  //   .frameLocator(stripeSelector)
  //   .getByPlaceholder("First and last name")
  //   .fill("Test Player")
  // await page
  //   .frameLocator(stripeSelector)
  //   .getByRole("combobox", { name: "Country or region" })
  //   .selectOption("GB")
  // await page
  //   .frameLocator(stripeSelector)
  //   .getByPlaceholder("Street address")
  //   .click()
  // await page
  //   .frameLocator(stripeSelector)
  //   .getByPlaceholder("Street address")
  //   .fill("NW31DE")
  // await expect(
  //   page
  //     .frameLocator(googleAutocompleteSelector)
  //     .getByLabel("Upper Hampstead Walk, London NW3 1DE, UK")
  // ).toBeVisible()
  // await page.keyboard.press("Enter")
  // await page.locator('[data-test="reviews-new-continue-button"]').click()
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByText(
  //     "Card numberSupported cards include visa, mastercard, amex, discover, diners, jcb"
  //   )
  //   .click()
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("1234 1234 1234 1234")
  //   .click()
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("1234 1234 1234 1234")
  //   .fill("4242 4242 4242 42422")
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("MM / YY")
  //   .click()
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("MM / YY")
  //   .fill("11 / 23")
  // await page.frameLocator(stripePaymentSelector).getByPlaceholder("CVC").click()
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("CVC")
  //   .fill("123")
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("WS11 1DB")
  //   .click()
  // await page
  //   .frameLocator(stripePaymentSelector)
  //   .getByPlaceholder("WS11 1DB")
  //   .fill("123123")
  // await page
  //   .locator('[data-test="checkout-save-payment-method-checkbox"]')
  //   .click()
  // await page.locator('[data-test="checkout-submit-button"]').click()
})

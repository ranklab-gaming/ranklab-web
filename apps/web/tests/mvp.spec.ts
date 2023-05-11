import { test, expect } from "@playwright/test"
import { Client } from "pg"
import fs from "fs/promises"
import { v4 as uuid } from "uuid"

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

const googleAutocompleteSelector =
  'iframe[title="Google autocomplete suggestions dropdown list"]'
const stripeSelector = 'iframe[title="undefined"]'
const stripePaymentSelector = 'iframe[title="Secure payment input frame"]'

test("mvp", async ({ page }) => {
  await page.goto(
    "http://ranklab-test:3000/api/auth/signin?token=123456789&user_type=coach&intent=signup"
  )
  await page.getByRole("button", { name: "Game ​" }).click()
  await page.locator('[data-test="game-select-overwatch"]').click()
  await page.getByLabel("Name").click()
  await page.getByLabel("Name").fill("Test Coach")
  await page.getByLabel("Email").click()
  await page.getByLabel("Email").fill("test1234@coach.com")
  await page.getByLabel("Password").click()
  await page.getByLabel("Password").fill("testcoach")
  await page.getByLabel("Bio").click()
  await page
    .getByLabel("Bio")
    .fill("A reasonably long bio that passes the checks on string length")
  await page.getByLabel("Price").click()
  await page.getByLabel("Price").click()
  await page.getByLabel("Price").press("Control+a")
  await page.getByLabel("Price").fill("12.34")
  await page.getByRole("button", { name: "Country United States" }).click()
  await page.getByRole("option", { name: "United Kingdom" }).click()
  await page.getByRole("button", { name: "Create Account" }).click()
  await page.getByRole("link", { name: "Start onboarding" }).click()
  await page.locator('[data-test="phone-help-text-test-mode"]').click()
  await page.locator('[data-test="phone-entry-submit"]').click()
  await page.locator('[data-test="test-mode-fill-button"]').click()
  await page.getByRole("button", { name: "Continue" }).click()
  await page.getByPlaceholder("First name").click()
  await page.getByPlaceholder("First name").fill("Eugenio Depalo")
  await page.getByPlaceholder("Last name").click()
  await page.getByPlaceholder("Last name").fill("Depaulis")
  await page.getByPlaceholder("DD").click()
  await page.getByPlaceholder("DD").fill("14")
  await page.getByPlaceholder("MM").fill("03")
  await page.getByPlaceholder("YYYY").fill("1990")
  await page.getByPlaceholder("YYYY").press("Enter")
  await page.locator('[data-test="test-mode-fill-button"]').click()
  await page.locator('[data-test="requirements-index-done-button"]').click()
  await page.getByRole("button", { name: "T", exact: true }).click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
  await page.goto("http://ranklab-test:3000/")
  await page.locator('[data-test="hero-get-started-button"]').click()
  await page.locator('[data-test="account-fields-game"]').click()
  await page.locator('[data-test="game-select-overwatch"]').click()
  await page.locator('[data-test="account-fields-skill-level"]').click()
  await page.locator('[data-test="account-fields-skill-level-2"]').click()
  await page.locator('[data-test="account-fields-name"]').click()
  await page.locator('[data-test="account-fields-name"]').fill("Test Player")
  await page
    .locator('[data-test="account-fields-email"]')
    .fill(`player+${uuid()}@example.com`)
  await page.locator('[data-test="account-fields-password"]').fill("testplayer")
  await page.locator('[data-test="signup-submit-button"]').click()
  await page.locator('[data-test="dashboard-request-review-button"]').click()
  await page.locator('[data-test="reviews-new-coach-field"]').click()
  await page.locator('[data-test="coach-select-0"]').click()
  await page.locator('[data-test="reviews-new-continue-button"]').click()
  await page
    .locator('[data-test="reviews-new-recording-video-field"]')
    .setInputFiles("tests/fixtures/exampleVideo.mp4")
  await page.locator(".ql-editor").click()
  await page.locator(".ql-editor").fill("some notes")
  await page.locator('[data-test="reviews-new-continue-button"]').click()
  await page
    .frameLocator(stripeSelector)
    .getByPlaceholder("First and last name")
    .click()
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
    .click()
  await page
    .frameLocator(stripeSelector)
    .getByPlaceholder("Street address")
    .fill("NW31DE")
  await expect(
    page
      .frameLocator(googleAutocompleteSelector)
      .getByLabel("Upper Hampstead Walk, London NW3 1DE, UK")
  ).toBeVisible()
  await page.keyboard.press("Enter")
  await page.locator('[data-test="reviews-new-continue-button"]').click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByText(
      "Card numberSupported cards include visa, mastercard, amex, discover, diners, jcb"
    )
    .click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("1234 1234 1234 1234")
    .click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("1234 1234 1234 1234")
    .fill("4242 4242 4242 42422")
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("MM / YY")
    .click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("MM / YY")
    .fill("11 / 23")
  await page.frameLocator(stripePaymentSelector).getByPlaceholder("CVC").click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("CVC")
    .fill("123")
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("WS11 1DB")
    .click()
  await page
    .frameLocator(stripePaymentSelector)
    .getByPlaceholder("WS11 1DB")
    .fill("123123")
  await page
    .locator('[data-test="checkout-save-payment-method-checkbox"]')
    .click()
  await page.locator('[data-test="checkout-submit-button"]').click()
})

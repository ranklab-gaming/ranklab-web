import { Page } from "@playwright/test"

export const signup = async ({
  page,
  name,
  email,
  password,
}: {
  page: Page
  name: string
  email: string
  password: string
}) => {
  await page.getByRole("link", { name: "Sign in" }).click()
  await page.getByRole("link", { name: "Get started" }).click()
  await page.getByLabel("Name").fill(name)
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  return await page.getByRole("button", { name: "Sign up" }).click()
}

export const logout = async (page: Page) => {
  await page.getByTitle("Account Popover").click()
  return await page.getByRole("menuitem", { name: "Logout" }).click()
}

export const signin = async ({
  page,
  email,
  password,
}: {
  page: Page
  email: string
  password: string
}) => {
  await page.getByRole("link", { name: "Sign in" }).click()
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign in" }).click()
}

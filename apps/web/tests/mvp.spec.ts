import { test, expect } from "@playwright/test"
import { v4 as uuid } from "uuid"
import { db, executeSqlFile } from "./mvp/db"
import { logout, signin, signup } from "./mvp/auth"
import {
  drawLine,
  seekTo,
  waitForRecordingToBeProcessed,
} from "./mvp/recording"

test.beforeEach(async () => {
  await db.connect()
  await executeSqlFile("tests/fixtures/resetData.sql")
  await executeSqlFile("tests/fixtures/seedData.sql")
})

test.afterEach(async () => {
  await db.end()
})

test("mvp", async ({ page }) => {
  const reviewerEmail = `reviewer+${uuid()}@example.com`
  const userEmail = `user+${uuid()}@example.com`
  const password = "testpassword"

  await page.goto("/")

  await signup({ page, name: "Test User", email: userEmail, password })

  // Create a VOD to review
  await page.getByTitle("Submit your VOD").click()
  await page.getByRole("combobox", { name: "Game" }).click()
  await page.getByRole("option", { name: "Overwatch" }).click()
  await page.getByRole("combobox", { name: "Skill Level" }).click()
  await page.getByRole("option", { name: "Platinum" }).click()
  await page
    .locator('[name="video"]')
    .setInputFiles("tests/fixtures/exampleVideo.mp4")
  await page
    .getByTitle("Notes")
    .locator("[contenteditable]")
    .first()
    .fill("some notes")
  await page.getByRole("button", { name: "Submit VOD" }).click()
  await expect(page.getByText("VOD submitted successfully")).toBeVisible()
  await waitForRecordingToBeProcessed()
  await logout(page)

  await signup({ page, name: "Test Reviewer", email: reviewerEmail, password })

  // Go to the review page
  await page.getByLabel("Overwatch", { exact: true }).click()
  await page.getByRole("link", { name: "exampleVideo" }).click()
  await expect(page.getByText("some notes")).toBeVisible()

  // Add a comment at around 00:03 by seeking
  await page.waitForFunction(
    () => document.querySelector("video")?.readyState === 4,
  )
  await seekTo(page, 0.3)
  await page.getByRole("button", { name: "Comment At" }).click()
  await page
    .getByTitle("Comment")
    .locator("[contenteditable]")
    .first()
    .fill("some comment")
  await drawLine(page, 0.3, 0.3, 0.7, 0.7)
  await page.getByRole("button", { name: "Save Comment" }).click()
  await expect(page.getByText("Comment saved successfully")).toBeVisible()

  // Comment should be deselected after saving
  await expect(page.getByTitle("Selected Comment")).toBeHidden()

  // Resume the video and wait 2 seconds
  await page.getByLabel("Play").click()
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // The video should pause when adding a comment
  await page.getByText("Comment At 00:05").click()
  await page.waitForFunction(
    () => document.querySelector("video")?.paused === true,
  )

  // Add a comment as a user
  await logout(page)
  await signin({ page, email: userEmail, password })
  await page.getByLabel("Overwatch", { exact: true }).click()
  await page.getByRole("link", { name: "exampleVideo" }).click()
  await page.getByRole("button", { name: "Comment At 00:00" }).click()
  await page
    .getByTitle("Comment")
    .locator("[contenteditable]")
    .first()
    .fill("some user comment")
  await page.getByRole("button", { name: "Save Comment" }).click()
  await expect(page.getByText("Comment saved successfully")).toBeVisible()

  // Select a comment made by the reviewer
  await page.getByRole("button", { name: "some comment" }).click()
  await page.waitForFunction(() => {
    const currentTime = document.querySelector("video")?.currentTime ?? 0
    return currentTime >= 2 && currentTime <= 4
  })
  await expect(page.getByLabel("Drawing").locator("path")).toHaveCount(1)
  await expect(page.getByLabel("Selected Comment")).toContainText(
    "some comment",
  )

  // Since the comment is not made by the user, editing mode should be disabled
  await expect(page.getByRole("button", { name: "Comment At" })).toBeVisible()

  // Playing should deselect the comment
  await page.getByLabel("Play").click()
  await page.waitForFunction(
    () => document.querySelector("video")?.paused === false,
  )
  await expect(page.getByTitle("Selected Comment")).toBeHidden()

  // When selecting a comment made by the user, editing mode should be enabled
  await page.getByRole("button", { name: "some user comment" }).click()
  await expect(page.getByTitle("Selected Comment")).toContainText(
    "some user comment",
  )
  await page.getByRole("button", { name: "Cancel" }).first().click()

  // Clicking a comment twice should deselect it
  await page.getByRole("button", { name: "some comment" }).click()
  await page.getByRole("button", { name: "some comment" }).click()
  await expect(page.getByTitle("Selected Comment")).toBeHidden()

  // Seeking should deselect the comment
  await page.getByRole("button", { name: "some comment" }).click()
  await seekTo(page, 0.5)
  await expect(page.getByTitle("Selected Comment")).toBeHidden()

  // Playing should change the icon to a pause button
  await page.getByLabel("Play").click()
  await page.waitForFunction(
    () => document.querySelector("video")?.paused === false,
  )
  await expect(page.getByLabel("Pause")).toBeVisible()

  // Pausing should change the icon to a play button
  await page.getByLabel("Pause").click()
  await page.waitForFunction(
    () => document.querySelector("video")?.paused === true,
  )
  await expect(page.getByLabel("Play")).toBeVisible()
})

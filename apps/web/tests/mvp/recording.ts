import { Locator, Page } from "@playwright/test"
import { db } from "./db"

const getPercentCoords = async (
  locator: Locator,
  xPercent: number,
  yPercent: number,
) => {
  const box = await locator.boundingBox()

  if (!box) {
    throw new Error("Bounding box not found")
  }

  const { x, y, width, height } = box

  return {
    x: x + width * xPercent,
    y: y + height * yPercent,
  }
}

export const drawLine = async (
  page: Page,
  startXPercent: number,
  startYPercent: number,
  endXPercent: number,
  endYPercent: number,
) => {
  const svgLocator = page.getByLabel("Drawing").locator("svg")

  const { x: startX, y: startY } = await getPercentCoords(
    svgLocator,
    startXPercent,
    startYPercent,
  )

  const { x: endX, y: endY } = await getPercentCoords(
    svgLocator,
    endXPercent,
    endYPercent,
  )

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(endX, endY)
  await page.mouse.up()
}

export const seekTo = async (page: Page, percent: number) => {
  const { x, y } = await getPercentCoords(
    page.getByRole("progressbar"),
    percent,
    0.5,
  )

  await page.mouse.click(x, y)
}

export const waitForRecordingToBeProcessed = async (
  attempts = 30,
): Promise<void> => {
  const result = await db.query(
    "SELECT state FROM recordings WHERE state = 'processed'",
  )

  if (result.rows.length > 0) {
    return
  }

  if (attempts === 0) {
    throw new Error("Recording not processed in time")
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return waitForRecordingToBeProcessed(attempts - 1)
}

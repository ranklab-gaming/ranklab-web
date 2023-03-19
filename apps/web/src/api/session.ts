import { SessionReview } from "@/session"

export async function saveReview(review: SessionReview) {
  await fetch("/api/save-review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
    credentials: "include",
  })
}

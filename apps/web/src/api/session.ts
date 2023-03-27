import { SessionReview } from "@/session"

export async function saveReview(review: SessionReview) {
  await fetch("/api/review", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
    credentials: "include",
  })
}

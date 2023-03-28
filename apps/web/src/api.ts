import { Configuration, RanklabApi } from "@ranklab/api"
import { SessionReview } from "./session"

function sessionReviewRequest(
  method: "PUT" | "POST",
  review?: Partial<SessionReview>
) {
  return fetch("/api/session-review", {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review ?? {}),
    credentials: "include",
  })
}

export function updateSessionReview(review?: Partial<SessionReview>) {
  return sessionReviewRequest("PUT", review)
}

export function createSessionReview(review?: Partial<SessionReview>) {
  return sessionReviewRequest("POST", review)
}

export const api = new RanklabApi(new Configuration({ basePath: "/api" }))

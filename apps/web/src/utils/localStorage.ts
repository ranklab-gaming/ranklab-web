interface Review {
  coachId: string
  recordingId: string
  notes: string
}

export const defaultReview: Review = {
  coachId: "",
  recordingId: "",
  notes: "",
}

export function getReview(): Review {
  if (typeof localStorage === "undefined") {
    return defaultReview
  }

  return JSON.parse(
    localStorage.getItem("review") || JSON.stringify(defaultReview)
  )
}

export function setReview(review: Partial<Review>) {
  localStorage.setItem(
    "review",
    JSON.stringify({
      ...getReview(),
      ...review,
    })
  )
}

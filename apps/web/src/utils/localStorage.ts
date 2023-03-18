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
  return JSON.parse(
    JSON.stringify(localStorage.getItem("review") || defaultReview)
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

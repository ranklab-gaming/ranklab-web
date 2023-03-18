import { useEffect, useState } from "react"

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

export function useReview(): [Review, (review: Partial<Review>) => void] {
  const [review, setReview] = useState<Review>(defaultReview)

  const updateReview = (newReview: Partial<Review>) => {
    const updatedReview = {
      ...review,
      ...newReview,
    }

    setReview(updatedReview)
    localStorage.setItem("review", JSON.stringify(updatedReview))
  }

  useEffect(() => {
    const storedReview = localStorage.getItem("review")

    if (storedReview) {
      setReview(JSON.parse(storedReview))
    }
  }, [])

  return [review, updateReview]
}

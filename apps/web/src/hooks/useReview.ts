import { ReviewContext } from "@/contexts/ReviewContext"
import { useContext } from "react"

export function useReview() {
  const review = useContext(ReviewContext)

  if (!review) {
    throw new Error("useReview must be used within a ReviewProvider")
  }

  return review
}

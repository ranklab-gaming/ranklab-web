import { CommentFormValues } from "@/coach/components/ReviewForm";
import { Comment, Review } from "@ranklab/api";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function useReviewFormState(form: UseFormReturn<CommentFormValues>, initialComments: Comment[], initialReview: Review) {
  const [commenting, setCommenting] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [comments, setComments] = useState(initialComments)
  const [review, setReview] = useState(initialReview)

  return {
    commenting,
    selectedComment,
    comments,
    setComments,
    setCommenting,
    review,
    setReview,
    setSelectedComment(comment: Comment | null) {
      if (comment) {
        form.setValue("metadata", comment.metadata, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        })

        form.setValue("body", comment.body, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        })

        setCommenting(Boolean(comment.body))
      } else {
        setCommenting(false)
        form.reset()
      }

      setSelectedComment(comment)
    }
  }
}

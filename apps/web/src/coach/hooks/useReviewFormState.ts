import { CommentFormValues } from "@/coach/components/ReviewForm";
import { Comment, Review } from "@ranklab/api";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function useReviewFormState(form: UseFormReturn<CommentFormValues>, initialComments: Comment[], initialReview: Review) {
  const [commenting, setCommenting] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [comments, setComments] = useState(initialComments)
  const [review, setReview] = useState(initialReview)
  const [previewAudioURL, setPreviewAudioURL] = useState<string | null>(null)
  const [editingAudio, setEditingAudio] = useState(false)

  const handlePreviewAudioURLChange = (url: string | null) => {
    if (previewAudioURL) {
      URL.revokeObjectURL(previewAudioURL)
    } else if (selectedComment) {
      setSelectedComment({
        ...selectedComment,
        audio: null,
      })
    }

    setPreviewAudioURL(url)
  }

  return {
    commenting,
    selectedComment,
    comments,
    setComments,
    setCommenting,
    review,
    setReview,
    previewAudioURL,
    setPreviewAudioURL: handlePreviewAudioURLChange,
    editingAudio,
    setEditingAudio,
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

        form.setValue("audio", Boolean(comment.audio) as any, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        })

        setEditingAudio(Boolean(comment.audio))
        setCommenting(Boolean(comment.body))
      } else {
        setCommenting(false)
        setPreviewAudioURL(null)
        setEditingAudio(false)
        form.reset()
      }

      setSelectedComment(comment)
    }
  }
}

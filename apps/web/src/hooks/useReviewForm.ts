import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { Comment, Game, MediaState, Recording } from "@ranklab/api"
import { useMemo, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import * as yup from "yup"
import { api } from "@/api"
import { assertProp } from "@/assert"
import { useUpload } from "@/hooks/useUpload"
import { useSnackbar } from "notistack"

const ReviewFormSchema = yup.object().shape({
  body: yup.string().defined(),
  metadata: yup.mixed().defined(),
})

export type ReviewFormValues = yup.InferType<typeof ReviewFormSchema> & {
  metadata: any
}

export interface ReviewForm {
  comments: Comment[]
  deleteComment: () => Promise<void>
  editingText: boolean
  form: UseFormReturn<ReviewFormValues>
  games: Game[]
  recording: Recording
  selectedComment: Comment | null
  setEditingText: (editingText: boolean) => void
  setRecording: (recording: Recording) => void
  setSelectedComment: (comment: Comment | null, ...args: any[]) => void
  submit: () => Promise<void>
  editing: boolean
}

interface Props {
  defaultMetadata: any
  comments: Comment[]
  recording: Recording
  games: Game[]
  editing?: boolean
  onCommentSelect: (comment: Comment | null, ...args: any[]) => void
  compareComments: (a: Comment, b: Comment) => number
  validate: (values: ReviewFormValues) => boolean
}

export function useReviewForm({
  comments: initialComments,
  recording: initialRecording,
  defaultMetadata,
  compareComments,
  games,
  onCommentSelect,
  validate,
  editing = false,
}: Props): ReviewForm {
  const [editingText, setEditingText] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [comments, setComments] = useState(initialComments)
  const [recording, setRecording] = useState(initialRecording)
  const sortedComments = useMemo(
    () => [...comments].sort(compareComments),
    [comments, compareComments],
  )
  const [upload] = useUpload()
  const { enqueueSnackbar } = useSnackbar()
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const formSchema = ReviewFormSchema.test("is-valid", (rawValues) => {
    const values = rawValues as ReviewFormValues

    return Boolean(
      values.body.length > 0 || validate(values as ReviewFormValues),
    )
  })

  const form = useForm<ReviewFormValues>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      body: "",
      metadata: defaultMetadata,
    },
  })

  const handleSelectComment = (comment: Comment | null, ...args: any[]) => {
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

      setEditingText(Boolean(comment.body))
    } else {
      setEditingText(false)
      form.reset()
    }

    onCommentSelect(comment, ...args)
    setSelectedComment(comment)
  }

  const handleSubmit = async (values: ReviewFormValues) => {
    let comment: Comment

    if (!selectedComment) {
      comment = await api.commentsCreate({
        createCommentRequest: {
          recordingId: recording.id,
          body: values.body,
          metadata: values.metadata,
        },
      })
    } else {
      comment = await api.commentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata,
        },
      })
    }

    enqueueSnackbar("Comment saved successfully.", {
      variant: "success",
    })

    setComments(
      selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments],
    )

    handleSelectComment(null)
  }

  const handleDeleteComment = async () => {
    if (!selectedComment) return

    await api.commentsDelete({
      id: selectedComment.id,
    })

    enqueueSnackbar("Comment deleted successfully.", {
      variant: "success",
    })

    handleSelectComment(null)
    setComments(comments.filter((c) => c.id !== selectedComment.id))
  }

  return {
    comments: sortedComments,
    deleteComment: handleDeleteComment,
    form,
    games,
    setRecording,
    recording,
    selectedComment,
    setSelectedComment: handleSelectComment,
    setEditingText,
    editingText,
    submit: form.handleSubmit(handleSubmit),
    editing: editingText || editing,
  }
}

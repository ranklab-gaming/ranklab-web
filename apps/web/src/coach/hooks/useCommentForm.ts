import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { Comment, Game, MediaState, Recording, Review } from "@ranklab/api"
import { useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import * as yup from "yup"
import { Audio } from "@ranklab/api"
import { api } from "@/api"
import { assertProp } from "@/assert"
import { useUpload } from "@/games/video/hooks/useUpload"
import { useSnackbar } from "notistack"

const CommentFormSchema = yup.object().shape({
  body: yup.string().defined(),
  metadata: yup.mixed().defined(),
  audio: yup.mixed().defined()
})

export interface CommentFormValues {
  body: string
  metadata: any
  audio: {
    value: Blob | boolean
  }
}

export interface CommentForm {
  comments: Comment[]
  deleteComment: () => Promise<void>
  editingAudio: boolean
  editingText: boolean
  form: UseFormReturn<CommentFormValues>
  games: Game[]
  previewAudioURL: string | null
  review: Review
  selectedComment: Comment | null
  setEditingAudio: (editingAudio: boolean) => void
  setEditingText: (editingText: boolean) => void
  setReview: (review: Review) => void
  setSelectedComment: (comment: Comment | null) => void
  sortedComments: Comment[]
  submit: () => Promise<void>
  recordingAudio: boolean
  startRecordingAudio: () => Promise<void>
  stopRecordingAudio: () => void
  removeAudio: () => void
  editing: boolean
  recording: Recording
}

interface Props {
  defaultMetadata: any
  comments: Comment[]
  review: Review
  games: Game[]
  editing?: boolean
  onCommentSelect: (comment: Comment | null) => void
  compareComments: (a: Comment, b: Comment) => number
  validate: (values: CommentFormValues) => boolean
}

export function useCommentForm({
  comments: initialComments,
  review: initialReview,
  defaultMetadata,
  compareComments,
  games,
  onCommentSelect,
  validate,
  editing = false,
}: Props): CommentForm {
  const [editingText, setEditingText] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [comments, setComments] = useState(initialComments)
  const [review, setReview] = useState(initialReview)
  const [previewAudioURL, setPreviewAudioURL] = useState<string | null>(null)
  const [editingAudio, setEditingAudio] = useState(false)
  const [recordingAudio, setRecordingAudio] = useState(false)
  const sortedComments = [...comments].sort(compareComments)
  const [upload] = useUpload()
  const { enqueueSnackbar } = useSnackbar()
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  let audioChunks: Blob[] = []

  const formSchema = CommentFormSchema.test("is-valid", (rawValues) => {
    const values = rawValues as CommentFormValues

    return Boolean(
      values.audio.value ||
      values.body.length > 0 ||
      validate(values as CommentFormValues)
    )
  })

  const form = useForm<CommentFormValues>({
    mode: "onChange",
    resolver: yupResolver<yup.ObjectSchema<any>>(formSchema),
    defaultValues: {
      body: "",
      metadata: defaultMetadata,
      audio: {
        value: false
      }
    },
  })

  const handlePreviewAudioURLChange = (url: string | null) => {
    if (previewAudioURL) {
      URL.revokeObjectURL(previewAudioURL)
    }

    setPreviewAudioURL(url)
  }

  const removeAudio = () => {
    handlePreviewAudioURLChange(null)

    form.setValue("audio", { value: false }, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const startRecordingAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    let mimeType: string | undefined

    mediaRecorder.current.onstart = () => {
      setRecordingAudio(true)
      mimeType = mediaRecorder.current?.mimeType
    }

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }

    mediaRecorder.current.onstop = async () => {
      setRecordingAudio(false)
      const blob = new Blob(audioChunks, { type: mimeType })
      const url = URL.createObjectURL(blob)

      handlePreviewAudioURLChange(url)

      form.setValue("audio", { value: blob }, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      audioChunks = []
    }

    mediaRecorder.current.start()
  }

  const stopRecordingAudio = () => {
    mediaRecorder.current?.stop()
  }

  const handleSelectComment = (comment: Comment | null) => {
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

      form.setValue("audio", { value: Boolean(comment.audio) }, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      setEditingAudio(Boolean(comment.audio))
      setEditingText(Boolean(comment.body))
    } else {
      setEditingText(false)
      setPreviewAudioURL(null)
      setEditingAudio(false)
      stopRecordingAudio()
      form.reset()
    }

    onCommentSelect(comment)
    setSelectedComment(comment)
  }

  const handleSubmit = async (values: CommentFormValues) => {
    let comment: Comment
    let audio: Audio | undefined
    const existingAudio = selectedComment?.audio

    if (values.audio.value === true) {
      audio = existingAudio ?? undefined
    } else if (values.audio instanceof Blob) {
      audio = await api.coachAudiosCreate({
        createAudioRequest: {
          reviewId: review.id,
        },
      })

      const uploadUrl = assertProp(audio, "uploadUrl")

      const headers: Record<string, string> = {
        "x-amz-acl": "public-read",
      }

      if (audio.instanceId) {
        headers["x-amz-meta-instance-id"] = audio.instanceId
      }

      await upload({
        file: new File([values.audio], "audio", {
          type: values.audio.type,
        }),
        url: uploadUrl,
        headers,
      })

      const audioId = audio.id

      const waitForAudioProcessed = async (retries = 20): Promise<boolean> => {
        const updatedAudio = await api.coachAudiosGet({
          id: audioId,
        })

        if (updatedAudio.state === MediaState.Processed) {
          return true
        }

        if (retries === 0) {
          return false
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        return waitForAudioProcessed(retries - 1)
      }

      if (!(await waitForAudioProcessed())) {
        enqueueSnackbar(
          "There was an error processing your audio. Please try again.",
          {
            variant: "error",
          }
        )

        return
      }
    }

    const audioId = audio?.id

    if (!selectedComment) {
      comment = await api.coachCommentsCreate({
        createCommentRequest: {
          reviewId: review.id,
          body: values.body,
          metadata: values.metadata,
          audioId,
        },
      })
    } else {
      comment = await api.coachCommentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata,
          audioId,
        },
      })
    }


    if (existingAudio && values.audio.value !== true) {
      await api.coachAudiosDelete({
        id: existingAudio.id,
      })
    }

    enqueueSnackbar("Comment saved successfully.", {
      variant: "success",
    })

    setComments(
      selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments]
    )

    onCommentSelect(null)
  }

  const handleDeleteComment = async () => {
    if (!selectedComment) return

    await api.coachCommentsDelete({
      id: selectedComment.id,
    })

    enqueueSnackbar("Comment deleted successfully.", {
      variant: "success",
    })

    onCommentSelect(null)
    setComments(comments.filter((c) => c.id !== selectedComment.id))
  }

  return {
    comments,
    deleteComment: handleDeleteComment,
    form,
    games,
    previewAudioURL,
    review,
    selectedComment,
    setReview,
    setSelectedComment: handleSelectComment,
    setEditingAudio,
    setEditingText,
    sortedComments,
    editingAudio,
    editingText,
    submit: form.handleSubmit(handleSubmit),
    startRecordingAudio,
    recordingAudio,
    stopRecordingAudio,
    removeAudio,
    editing: editingAudio || editingText || editing,
    recording: assertProp(review, "recording"),
  }
}

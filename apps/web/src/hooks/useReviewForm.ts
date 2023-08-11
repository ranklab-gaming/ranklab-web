import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { Comment, Game, MediaState, Recording } from "@ranklab/api"
import { useMemo, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import * as yup from "yup"
import { Audio } from "@ranklab/api"
import { api } from "@/api"
import { assertProp } from "@/assert"
import { useUpload } from "@/hooks/useUpload"
import { useSnackbar } from "notistack"

const ReviewFormSchema = yup.object().shape({
  body: yup.string().defined(),
  metadata: yup.mixed().defined(),
  audio: yup.object().shape({
    value: yup.mixed({
      check: (value: any): value is Blob | boolean =>
        value instanceof Blob || typeof value === "boolean",
    }),
  }),
})

export type ReviewFormValues = yup.InferType<typeof ReviewFormSchema> & {
  metadata: any
}

export interface ReviewForm {
  comments: Comment[]
  deleteComment: () => Promise<void>
  editingAudio: boolean
  editingText: boolean
  form: UseFormReturn<ReviewFormValues>
  games: Game[]
  previewAudioURL: string | null
  recording: Recording
  selectedComment: Comment | null
  setEditingAudio: (editingAudio: boolean) => void
  setEditingText: (editingText: boolean) => void
  setRecording: (recording: Recording) => void
  setSelectedComment: (comment: Comment | null, ...args: any[]) => void
  submit: () => Promise<void>
  recordingAudio: boolean
  startRecordingAudio: () => Promise<void>
  stopRecordingAudio: () => void
  removeAudio: () => void
  editing: boolean
  startedRecordingAudioAt: Date | null
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
  const [previewAudioURL, setPreviewAudioURL] = useState<string | null>(null)
  const [editingAudio, setEditingAudio] = useState(false)
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [startedRecordingAudioAt, setStartedRecordingAudioAt] =
    useState<Date | null>(null)
  const sortedComments = useMemo(
    () => [...comments].sort(compareComments),
    [comments, compareComments],
  )
  const [upload] = useUpload()
  const { enqueueSnackbar } = useSnackbar()
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  let audioChunks: Blob[] = []

  const formSchema = ReviewFormSchema.test("is-valid", (rawValues) => {
    const values = rawValues as ReviewFormValues

    return Boolean(
      values.audio.value ||
        values.body.length > 0 ||
        validate(values as ReviewFormValues),
    )
  })

  const form = useForm<ReviewFormValues>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      body: "",
      metadata: defaultMetadata,
      audio: {
        value: false,
      },
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

    form.setValue(
      "audio",
      { value: false },
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      },
    )
  }

  const startRecordingAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    let mimeType: string | undefined

    mediaRecorder.current.onstart = () => {
      setRecordingAudio(true)
      setStartedRecordingAudioAt(new Date())
      mimeType = mediaRecorder.current?.mimeType
    }

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }

    mediaRecorder.current.onstop = async () => {
      setRecordingAudio(false)
      setStartedRecordingAudioAt(null)
      const blob = new Blob(audioChunks, { type: mimeType })
      const url = URL.createObjectURL(blob)

      handlePreviewAudioURLChange(url)

      form.setValue(
        "audio",
        { value: blob },
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        },
      )

      audioChunks = []
    }

    mediaRecorder.current.start()
  }

  const stopRecordingAudio = () => {
    mediaRecorder.current?.stop()
  }

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

      form.setValue(
        "audio",
        { value: Boolean(comment.audio) },
        {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        },
      )

      setEditingAudio(Boolean(comment.audio))
      setEditingText(Boolean(comment.body))
    } else {
      setEditingText(false)
      setPreviewAudioURL(null)
      setEditingAudio(false)
      stopRecordingAudio()
      form.reset()
    }

    onCommentSelect(comment, ...args)
    setSelectedComment(comment)
  }

  const handleSubmit = async (values: ReviewFormValues) => {
    let comment: Comment
    let audio: Audio | undefined
    const existingAudio = selectedComment?.audio

    if (values.audio.value === true) {
      audio = existingAudio ?? undefined
    } else if (values.audio.value instanceof Blob) {
      audio = await api.audiosCreate()
      const uploadUrl = assertProp(audio, "uploadUrl")

      const headers: Record<string, string> = {
        "x-amz-acl": "public-read",
      }

      if (audio.instanceId) {
        headers["x-amz-meta-instance-id"] = audio.instanceId
      }

      await upload({
        file: new File([values.audio.value], "audio", {
          type: values.audio.value.type,
        }),
        url: uploadUrl,
        headers,
      })

      const audioId = audio.id

      const waitForAudioProcessed = async (retries = 60): Promise<boolean> => {
        const updatedAudio = await api.audiosGet({
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
          },
        )

        return
      }
    }

    const audioId = audio?.id

    if (!selectedComment) {
      comment = await api.commentsCreate({
        createCommentRequest: {
          recordingId: recording.id,
          body: values.body,
          metadata: values.metadata,
          audioId,
        },
      })
    } else {
      comment = await api.commentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata,
          audioId,
        },
      })
    }

    if (existingAudio && values.audio.value !== true) {
      await api.audiosDelete({
        id: existingAudio.id,
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
    previewAudioURL,
    setRecording,
    recording,
    selectedComment,
    setSelectedComment: handleSelectComment,
    setEditingAudio,
    setEditingText,
    editingAudio,
    editingText,
    submit: form.handleSubmit(handleSubmit),
    startRecordingAudio,
    recordingAudio,
    stopRecordingAudio,
    removeAudio,
    editing: editingAudio || editingText || editing,
    startedRecordingAudioAt,
  }
}

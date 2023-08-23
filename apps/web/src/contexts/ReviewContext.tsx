import { Game, Recording, Comment } from "@ranklab/api"
import { PropsWithChildren, createContext } from "react"
import { UseFormReturn } from "react-hook-form"
import * as yup from "yup"

export const ReviewFormSchema = yup
  .object()
  .shape({
    body: yup.string().defined(),
    metadata: yup.mixed().defined(),
  })
  .test("is-valid", (values) => {
    values.body.length > 0 || (values.metadata as any).video.drawing.length > 0
  })

export type ReviewFormValues = yup.InferType<typeof ReviewFormSchema>

export const colors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

export type Color = (typeof colors)[number]

interface ReviewContext {
  color: Color
  comments: Comment[]
  deleteComment: () => Promise<void>
  editing: boolean
  editingDrawing: boolean
  editingText: boolean
  form: UseFormReturn<ReviewFormValues>
  games: Game[]
  playing: boolean
  readOnly: boolean
  recording: Recording
  saveComment: () => Promise<void>
  selectedComment: Comment | null
  setColor: (color: Color) => void
  setEditingDrawing: (editingDrawing: boolean) => void
  setEditingText: (editingText: boolean) => void
  setPlaying: (playing: boolean) => void
  setRecording: (recording: Recording) => void
  setSelectedComment: (comment: Comment | null, ...args: any[]) => void
  setTimestamp: (timestamp: number) => void
  timestamp: number
}

export const ReviewContext = createContext<ReviewContext | null>(null)

export const ReviewProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: ReviewContext }>) => {
  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  )
}

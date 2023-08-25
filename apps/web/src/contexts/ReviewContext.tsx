import { CommentFormValues } from "@/components/RecordingShowPage"
import { Game, Recording, Comment } from "@ranklab/api"
import { PropsWithChildren, createContext } from "react"
import { UseFormReturn } from "react-hook-form"

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
  form: UseFormReturn<CommentFormValues>
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
  setSelectedComment: (comment: Comment | null, shouldPause?: boolean) => void
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

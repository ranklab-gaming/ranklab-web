import { CommentFormValues } from "@/components/RecordingShowPage"
import { Game, Recording, Comment } from "@ranklab/api"
import { PropsWithChildren, createContext } from "react"
import { UseControllerReturn, UseFormReturn } from "react-hook-form"

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
  form: UseFormReturn<CommentFormValues>
  games: Game[]
  playing: boolean
  recording: Recording
  saveComment: () => Promise<void>
  selectedComment: Comment | null
  setColor: (color: Color) => void
  setEditing: (editing: boolean) => void
  setPlaying: (playing: boolean) => void
  setSelectedComment: (comment: Comment | null, shouldPause?: boolean) => void
  metadataController: UseControllerReturn<CommentFormValues, "metadata">
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

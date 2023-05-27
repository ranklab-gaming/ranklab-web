import { Box } from "@mui/material"
import { Comment, Review } from "@ranklab/api"
import { UseFormReturn } from "react-hook-form"
import { Toolbar } from "./Toolbar"

import { CommentFormValues } from "@/coach/components/ReviewForm"
import { PropsWithChildren } from "react"

interface Props {
  commenting: boolean
  comments: Comment[]
  form: UseFormReturn<CommentFormValues>
  onCommentSelect: (comment: Comment | null) => void
  onCommentingChange: (commenting: boolean) => void
  onCommentsChange: (comments: Comment[]) => void
  selectedComment: Comment | null
  review: Review
  editing?: boolean
  toolbarElement?: JSX.Element
}

export const Recording = ({
  form,
  commenting,
  onCommentingChange,
  comments,
  onCommentsChange,
  selectedComment,
  onCommentSelect,
  review,
  editing,
  toolbarElement,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <Toolbar
        selectedComment={selectedComment}
        comments={comments}
        commenting={commenting}
        form={form}
        review={review}
        onCommentsChange={onCommentsChange}
        onCommentSelect={onCommentSelect}
        onCommentingChange={onCommentingChange}
        editing={editing}
      >
        {toolbarElement}
      </Toolbar>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
      >
        {children}
      </Box>
    </>
  )
}

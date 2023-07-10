import { theme } from "@/theme/theme"
import { Card, CardContent, Stack, CardActionArea } from "@mui/material"
import { m, AnimatePresence } from "framer-motion"
import { useGameDependency } from "@/hooks/useGameDependency"
import { MessageBox } from "@/components/MessageBox"
import { Comment } from "@ranklab/api"

interface Props {
  comments: Comment[]
  onCommentSelect: (comment: Comment | null) => void
  selectedComment: Comment | null
}

export const CommentList = ({
  comments,
  onCommentSelect,
  selectedComment,
}: Props) => {
  const CommentListItem = useGameDependency("component:comment-list-item")
  const emptyCommentsText = useGameDependency("text:empty-comments-text")

  if (comments.length === 0) {
    return (
      <MessageBox icon="eva:corner-up-left-outline" text={emptyCommentsText} />
    )
  }

  return (
    <Card sx={{ minHeight: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <AnimatePresence>
            {comments.map((comment) => (
              <Card
                key={comment.id}
                component={m.div}
                initial="initial"
                animate={selectedComment === comment ? "selected" : "animate"}
                variants={{
                  initial: {
                    opacity: 0,
                    backgroundColor: theme.palette.background.paper,
                    scaleX: 0,
                  },
                  animate: {
                    opacity: 1,
                    backgroundColor: theme.palette.background.paper,
                    scaleX: 1,
                  },
                  exit: {
                    opacity: 0,
                    scaleX: 0,
                  },
                  selected: {
                    opacity: 1,
                    scaleX: 1,
                    backgroundColor: theme.palette.secondary.main,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => {
                    if (selectedComment === comment) {
                      onCommentSelect(null)
                    } else {
                      onCommentSelect(comment)
                    }
                  }}
                >
                  <CardContent>
                    <CommentListItem
                      comment={comment}
                      selected={comment === selectedComment}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </AnimatePresence>
        </Stack>
      </CardContent>
    </Card>
  )
}

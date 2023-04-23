import { Comment } from "@ranklab/api"
import { theme } from "@/theme/theme"
import { Card, CardContent, Stack, CardActionArea } from "@mui/material"
import { m, AnimatePresence } from "framer-motion"
import { useGameComponent } from "@/hooks/useGameComponent"

interface Props {
  comments: Comment[]
  selectedComment: Comment | null
  onCommentSelect: (comment: Comment | null) => void
}

export const CommentList = ({
  comments,
  selectedComment,
  onCommentSelect,
}: Props) => {
  const CommentListItem = useGameComponent("CommentListItem")

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

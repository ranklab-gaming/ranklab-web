import { Iconify } from "@/components/Iconify"
import { formatDuration } from "@/helpers/formatDuration"
import { theme } from "@/theme/theme"
import {
  Card,
  CardContent,
  Stack,
  CardActionArea,
  Typography,
  Box,
  Tooltip,
} from "@mui/material"
import { Comment } from "@ranklab/api"
import { m, AnimatePresence } from "framer-motion"

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
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Card
              key={comment.id}
              component={m.div}
              initial="initial"
              animate={selectedComment === comment ? "selected" : "initial"}
              variants={{
                initial: {
                  backgroundColor: theme.palette.background.paper,
                },
                selected: {
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
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2">
                        {formatDuration(comment.videoTimestamp)}
                      </Typography>
                      <AnimatePresence initial={false}>
                        {selectedComment !== comment && comment.body ? (
                          <Typography
                            variant="body2"
                            noWrap
                            textOverflow="ellipsis"
                            overflow="hidden"
                            component={m.div}
                            key="body"
                            variants={{
                              initial: {
                                opacity: 0,
                              },
                              animate: {
                                opacity: 1,
                              },
                            }}
                            initial="initial"
                            animate="animate"
                            flexGrow={1}
                          >
                            {comment.body}
                          </Typography>
                        ) : (
                          <Box flexGrow={1} />
                        )}
                      </AnimatePresence>
                      <Box>
                        {comment.drawing ? (
                          <Tooltip title="Drawing">
                            <Iconify
                              icon="mdi:gesture"
                              width={24}
                              height={24}
                            />
                          </Tooltip>
                        ) : null}
                      </Box>
                    </Stack>
                    <AnimatePresence>
                      {selectedComment === comment && comment.body ? (
                        <Typography
                          variant="body1"
                          key="body"
                          component={m.div}
                          variants={{
                            initial: {
                              opacity: 0,
                              height: 0,
                            },
                            animate: {
                              opacity: 1,
                              height: "auto",
                            },
                            exit: {
                              height: 0,
                              padding: 0,
                              margin: 0,
                              opacity: 0,
                            },
                          }}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {comment.body}
                        </Typography>
                      ) : null}
                    </AnimatePresence>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

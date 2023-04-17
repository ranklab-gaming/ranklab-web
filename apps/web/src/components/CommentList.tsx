import { Iconify } from "@/components/Iconify"
import { Comment } from "@ranklab/api"
import { theme } from "@/theme/theme"
import {
  Card,
  CardContent,
  Stack,
  CardActionArea,
  Typography,
  Tooltip,
  Box,
} from "@mui/material"
import { formatDuration } from "@/helpers/formatDuration"
import { m, AnimatePresence } from "framer-motion"
import { formatMove } from "@/utils/chess"

interface Props {
  comments: Comment[]
  selectedComment: Comment | null
  onCommentSelect: (comment: Comment | null) => void
  currentChessMove?: any
}

export const CommentList = ({
  comments,
  selectedComment,
  onCommentSelect,
  currentChessMove,
}: Props) => {
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
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          {comment.metadata.video.timestamp != null
                            ? formatDuration(
                                comment.metadata.video.timestamp / 1000000
                              )
                            : currentChessMove
                            ? formatMove(comment.metadata.chess.move)
                            : null}
                        </Typography>
                        <AnimatePresence initial={false}>
                          {selectedComment !== comment ? (
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
                              {comment.preview}
                            </Typography>
                          ) : (
                            <Box flexGrow={1} />
                          )}
                        </AnimatePresence>
                        <Box>
                          {comment.drawing ? (
                            <Tooltip title="Drawing">
                              <Iconify icon="mdi:draw" width={24} height={24} />
                            </Tooltip>
                          ) : null}
                        </Box>
                      </Stack>
                      {comment.body ? (
                        <AnimatePresence>
                          {selectedComment === comment ? (
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
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: comment.body,
                                }}
                              />
                            </Typography>
                          ) : null}
                        </AnimatePresence>
                      ) : null}
                    </Stack>
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

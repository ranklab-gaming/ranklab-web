import { theme } from "@/theme/theme"
import { Card, CardContent, Stack, CardActionArea, Box } from "@mui/material"
import { m, AnimatePresence } from "framer-motion"
import { useOptionalUser } from "@/hooks/useUser"
import { useRouter } from "next/router"
import { formatDuration } from "@/helpers/formatDuration"
import { CommentListItem } from "./CommentListItem"
import { useMemo } from "react"
import { useReview } from "@/hooks/useReview"
import { parseISO } from "date-fns"
import { Iconify } from "../Iconify"
import { MessageBox } from "../MessageBox"

export const CommentList = () => {
  const user = useOptionalUser()
  const router = useRouter()
  const { comments, selectedComment, setSelectedComment } = useReview()

  const returnUrl = {
    pathname: "/api/auth/signin",
    query: {
      return_url: router.asPath,
    },
  }

  const sortedComments = useMemo(
    () =>
      [...comments].sort((a, b) => {
        const diff = a.metadata.video.timestamp - b.metadata.video.timestamp

        if (diff === 0) {
          return (
            parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
          )
        }

        return diff
      }),
    [comments],
  )

  if (comments.length === 0) {
    return (
      <Stack
        spacing={3}
        sx={{
          textAlign: "center",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <MessageBox
          text={
            user
              ? "There are currently no comments on this VOD."
              : "Be the first to add a comment."
          }
          icon={<Iconify icon="mdi:sms" width={64} height={64} />}
          actionText="Add a comment"
          href={user ? null : returnUrl}
        />
      </Stack>
    )
  }

  return (
    <Box sx={{ flex: 1, maxWidth: "100%" }}>
      <AnimatePresence initial={false}>
        <Stack spacing={1}>
          {sortedComments.map((comment) => (
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
                    setSelectedComment(null)
                  } else {
                    setSelectedComment(comment)
                  }
                }}
              >
                <CardContent>
                  <CommentListItem
                    comment={comment}
                    title={formatDuration(
                      comment.metadata.video.timestamp / 1000000,
                    )}
                    selected={comment === selectedComment}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </AnimatePresence>
    </Box>
  )
}

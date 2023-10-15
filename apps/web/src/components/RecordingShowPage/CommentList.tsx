import { theme } from "@/theme/theme"
import {
  Card,
  CardContent,
  Stack,
  CardActionArea,
  Button,
  Typography,
  Box,
} from "@mui/material"
import { m, AnimatePresence } from "framer-motion"
import NextLink from "next/link"
import { useOptionalUser } from "@/hooks/useUser"
import { useRouter } from "next/router"
import { formatDuration } from "@/helpers/formatDuration"
import { CommentListItem } from "./CommentListItem"
import { useMemo } from "react"
import { useReview } from "@/hooks/useReview"
import { parseISO } from "date-fns"
import { Iconify } from "../Iconify"

export const CommentList = () => {
  const user = useOptionalUser()
  const router = useRouter()

  const { comments, selectedComment, setSelectedComment, games, recording } =
    useReview()

  const returnUrl = {
    pathname: "/api/auth/signin",
    query: {
      return_url: router.asPath,
    },
  }

  const addACommentButton = (
    <NextLink href={returnUrl} passHref legacyBehavior>
      <Button
        variant="text"
        sx={{
          fontSize: 18,
          color: "common.white",
          transition: "all 0.25s",
          backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
          boxShadow: "0 4px 12px 0 rgba(0,0,0,.35)",
          "&:hover": {
            filter: "brightness(1.3)",
          },
          py: 1,
          px: 2,
        }}
      >
        Add a comment
      </Button>
    </NextLink>
  )

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
        {!user ? (
          addACommentButton
        ) : (
          <Iconify icon="mdi:sms" width={64} height={64} />
        )}
        <Typography variant="h3">
          {!user
            ? "Be the first to add a comment."
            : "There are currently no comments on this VOD."}
        </Typography>
      </Stack>
    )
  }

  return (
    <Box sx={{ flex: 1 }}>
      <AnimatePresence initial={false}>
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
                  games={games}
                  recording={recording}
                />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </AnimatePresence>
    </Box>
  )
}

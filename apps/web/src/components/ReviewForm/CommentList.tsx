import { theme } from "@/theme/theme"
import { Card, CardContent, Stack, CardActionArea, Button } from "@mui/material"
import { m, AnimatePresence } from "framer-motion"
import { useGameDependency } from "@/hooks/useGameDependency"
import { MessageBox } from "@/components/MessageBox"
import { Comment, Game, Recording } from "@ranklab/api"
import NextLink from "next/link"
import { useOptionalUser } from "@/hooks/useUser"
import { useRouter } from "next/router"

interface Props {
  comments: Comment[]
  onCommentSelect: (comment: Comment | null) => void
  selectedComment: Comment | null
  games: Game[]
  recording: Recording
}

export const CommentList = ({
  comments,
  onCommentSelect,
  selectedComment,
  games,
  recording,
}: Props) => {
  const CommentListItem = useGameDependency("component:comment-list-item")
  const emptyCommentsText = useGameDependency("text:empty-comments-text")
  const firstCommentText = useGameDependency("text:first-comment-text")
  const user = useOptionalUser()
  const router = useRouter()

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

  if (comments.length === 0) {
    return (
      <MessageBox
        icon={!user ? addACommentButton : "eva:corner-up-left-outline"}
        text={!user ? firstCommentText : emptyCommentsText}
      />
    )
  }

  return (
    <Card sx={{ minHeight: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          {!user ? addACommentButton : null}
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
                      games={games}
                      recording={recording}
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

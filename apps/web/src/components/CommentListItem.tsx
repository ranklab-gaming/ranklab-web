import { assertFind } from "@/assert"
import { Iconify } from "@/components/Iconify"
import { uploadsCdnUrl } from "@/config"
import { UserContext } from "@/contexts/UserContext"
import { Stack, Typography, Box, Tooltip, Chip } from "@mui/material"
import { Comment, Game, MediaState, Recording } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { PropsWithChildren, useContext } from "react"

export interface CommentListItemProps {
  comment: Comment
  selected: boolean
  title: string
  games: Game[]
  recording: Recording
}

export const CommentListItem = ({
  comment,
  selected,
  title,
  children,
  games,
  recording,
}: PropsWithChildren<CommentListItemProps>) => {
  const user = useContext(UserContext)

  const game = assertFind(games, (g) => g.id === recording.gameId)

  const skillLevel = game.skillLevels.find(
    (sl) => sl.value === comment.user?.skillLevel,
  )

  return (
    <Stack spacing={2}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2">{title}</Typography>
          <Chip
            size="small"
            label={comment.user?.name}
            variant="outlined"
            color={user && user.id === comment.user?.id ? "primary" : "default"}
          />
          {skillLevel && (!user || user.id !== comment.user?.id) ? (
            <Chip size="small" label={skillLevel.name} />
          ) : null}
        </Stack>
        <AnimatePresence initial={false}>
          {!selected ? (
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
        {children}
      </Stack>
      {comment.body ? (
        <AnimatePresence>
          {selected ? (
            <Stack spacing={1}>
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
            </Stack>
          ) : null}
        </AnimatePresence>
      ) : null}
    </Stack>
  )
}

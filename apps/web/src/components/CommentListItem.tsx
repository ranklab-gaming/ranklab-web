import { Iconify } from "@/components/Iconify"
import { uploadsCdnUrl } from "@/config"
import { UserContext } from "@/contexts/UserContext"
import { Stack, Typography, Box, Tooltip, Chip } from "@mui/material"
import { Comment, MediaState } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { PropsWithChildren, useContext } from "react"

export interface CommentListItemProps {
  comment: Comment
  selected: boolean
  title: string
}

export const CommentListItem = ({
  comment,
  selected,
  title,
  children,
}: PropsWithChildren<CommentListItemProps>) => {
  const user = useContext(UserContext)

  return (
    <Stack spacing={2}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2">{title}</Typography>
          <Chip
            size="small"
            label={comment.user?.name}
            variant={
              user && user.id === comment.user?.id ? "filled" : "outlined"
            }
          />
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
        {comment.audio ? (
          <Box>
            <Tooltip title="Audio Clip">
              <Iconify icon="eva:mic-outline" width={24} height={24} />
            </Tooltip>
          </Box>
        ) : null}
        {children}
      </Stack>
      {comment.body || comment.audio?.transcript ? (
        <AnimatePresence>
          {selected ? (
            <Stack spacing={1}>
              {comment.audio?.state === MediaState.Processed ? (
                <audio
                  controls
                  src={`${uploadsCdnUrl}/${comment.audio.audioKey}`}
                />
              ) : null}
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
                <Stack spacing={2}>
                  {comment.audio?.transcript ? (
                    <Typography variant="caption" fontStyle="italic">
                      {comment.audio.transcript}
                    </Typography>
                  ) : null}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: comment.body,
                    }}
                  />
                </Stack>
              </Typography>
            </Stack>
          ) : null}
        </AnimatePresence>
      ) : null}
    </Stack>
  )
}

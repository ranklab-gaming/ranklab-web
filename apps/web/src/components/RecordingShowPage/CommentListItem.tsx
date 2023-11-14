import { Iconify } from "@/components/Iconify"
import { UserContext } from "@/contexts/UserContext"
import { Stack, Typography, Box, Chip, Tooltip } from "@mui/material"
import { Comment } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { useContext } from "react"
import { Avatar } from "../Avatar"
import { assertProp } from "@/assert"

interface ItemProps {
  comment: Comment
  selected: boolean
  title: string
}

export const CommentListItem = ({ comment, selected, title }: ItemProps) => {
  const user = useContext(UserContext)
  const commentUser = assertProp(comment, "user")

  return (
    <Stack spacing={2} title={selected ? "Selected Comment" : ""}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2">{title}</Typography>
          <Box flexGrow={1} />
          <Chip
            size="small"
            label={commentUser.name}
            variant="outlined"
            color={user && user.id === commentUser.id ? "primary" : "default"}
          />
          <Avatar user={commentUser} />
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
        {comment.metadata.video.drawing ? (
          <Box>
            <Tooltip title="Drawing">
              <Iconify icon="mdi:draw" width={24} height={24} />
            </Tooltip>
          </Box>
        ) : null}
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

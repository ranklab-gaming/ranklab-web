import { Stack, Typography, Box } from "@mui/material"
import { Comment } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { PropsWithChildren } from "react"

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
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2">{title}</Typography>
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
  )
}

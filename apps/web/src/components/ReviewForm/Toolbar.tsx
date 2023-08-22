import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { LoadingButton } from "@mui/lab"
import { PropsWithChildren, useEffect, useState } from "react"
import { ReviewForm } from "@/hooks/useReviewForm"
import { formatDuration } from "@/helpers/formatDuration"

export interface ToolbarProps {
  reviewForm: ReviewForm
  disabled?: boolean
}

export const Toolbar = ({
  reviewForm,
  children,
  disabled = false,
}: PropsWithChildren<ToolbarProps>) => {
  const theme = useTheme()
  const [now, setNow] = useState<number | null>(null)

  const {
    setEditingText,
    editingText,
    selectedComment,
    deleteComment,
    editing,
    setSelectedComment,
    form,
  } = reviewForm

  return (
    <AnimatePresence presenceAffectsLayout mode="popLayout">
      {disabled ? (
        <Box
          key="disabled"
          height={54}
          component={m.div}
          variants={animateFade().in}
          animate="animate"
          initial="initial"
          exit="exit"
        />
      ) : (
        <Box
          key="enabled"
          component={m.div}
          variants={animateFade().in}
          animate="animate"
          initial="initial"
          exit="exit"
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            p={1}
            component={m.div}
            variants={animateFade().in}
            key="toolbar"
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <Tooltip title="Comment">
              <IconButton
                onClick={() => {
                  setEditingText(!editingText)
                }}
                sx={editingText ? { color: theme.palette.secondary.main } : {}}
              >
                <Iconify icon="mdi:comment-text" width={22} fontSize={22} />
              </IconButton>
            </Tooltip>
            {children}
            {selectedComment && !disabled ? (
              <Tooltip title="Delete">
                <ConfirmationButton
                  action={deleteComment}
                  buttonIcon={
                    <Iconify
                      icon="mdi:trash-can-outline"
                      width={22}
                      fontSize={22}
                    />
                  }
                  dialogContentText="Are you sure you want to delete this comment?"
                  dialogTitle="Delete Comment"
                />
              </Tooltip>
            ) : null}
            <Box flexGrow={1} />
            <AnimatePresence>
              {editing ? (
                <Box
                  component={m.div}
                  variants={animateFade().in}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Button
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor: theme.palette.grey[900],
                        },
                      }}
                      onClick={() => {
                        setSelectedComment(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      type="submit"
                      loading={form.formState.isSubmitting}
                      disabled={
                        form.formState.isSubmitting || !form.formState.isValid
                      }
                    >
                      Save Comment
                    </LoadingButton>
                  </Stack>
                </Box>
              ) : null}
            </AnimatePresence>
          </Stack>
        </Box>
      )}
    </AnimatePresence>
  )
}

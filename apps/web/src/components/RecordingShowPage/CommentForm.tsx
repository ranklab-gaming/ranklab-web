import { Box, Button, FormHelperText, Stack, Tooltip } from "@mui/material"
import { Toolbar } from "./CommentForm/Toolbar"
import { DrawingRef } from "./Drawing"
import { useReview } from "@/hooks/useReview"
import { theme } from "@/theme/theme"
import { Controller } from "react-hook-form"
import { Editor } from "../Editor"
import { ConfirmationButton } from "../ConfirmationDialog"
import { Iconify } from "../Iconify"
import { LoadingButton } from "@mui/lab"

interface Props {
  drawingRef: React.RefObject<DrawingRef>
}

export const CommentForm = ({ drawingRef }: Props) => {
  const { form, selectedComment, deleteComment, setSelectedComment } =
    useReview()

  return (
    <Box>
      <Toolbar drawingRef={drawingRef} />
      <Controller
        name="body"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <Box bgcolor="grey.900" borderRadius={1}>
            <Editor
              value={field.value}
              onChange={(value) => {
                const element = document.createElement("div")
                element.innerHTML = value

                if (!element.textContent) {
                  field.onChange("")
                } else {
                  field.onChange(value)
                }
              }}
              onBlur={field.onBlur}
              error={Boolean(error)}
              sx={{
                height: 200,
              }}
            />
            <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
              {error ? error.message : null}
            </FormHelperText>
          </Box>
        )}
      />
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        p={1}
      >
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
          variant="contained"
          color="primary"
          type="submit"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          Save Comment
        </LoadingButton>
      </Stack>
    </Box>
  )
}

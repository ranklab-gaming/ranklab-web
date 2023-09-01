import { Box, FormHelperText, Stack, alpha } from "@mui/material"
import { Toolbar } from "./CommentForm/Toolbar"
import { DrawingRef } from "./Drawing"
import { useReview } from "@/hooks/useReview"
import { theme } from "@/theme/theme"
import { Controller } from "react-hook-form"
import { Editor } from "../Editor"

interface Props {
  drawingRef: React.RefObject<DrawingRef>
}

export const CommentForm = ({ drawingRef }: Props) => {
  const { form, readOnly } = useReview()

  return (
    <Stack>
      {readOnly ? null : (
        <Controller
          name="body"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <Box>
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
                  backgroundColor: alpha(theme.palette.common.black, 0.75),
                  height: 200,
                  borderWidth: 0,
                  borderRadius: 0,
                }}
              />
              <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                {error ? error.message : null}
              </FormHelperText>
            </Box>
          )}
        />
      )}
      <Toolbar drawingRef={drawingRef} />
    </Stack>
  )
}

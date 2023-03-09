import { Iconify } from "@/components/Iconify"
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { forwardRef, ReactNode, useId } from "react"

interface Props {
  error?: boolean
  helperText?: ReactNode
  value?: File
  onChange: (file?: File) => void
}

export const VideoFileSelect = forwardRef<HTMLDivElement, Props>(function (
  { error, helperText, onChange, value },
  ref
) {
  const id = useId().slice(1, -1)

  return (
    <Box sx={{ width: "100%" }} ref={ref}>
      <FormControl
        sx={{ width: "100%", cursor: "pointer" }}
        component="label"
        htmlFor={id}
      >
        <input
          id={id}
          style={{ display: "none" }}
          accept="video/*"
          type="file"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
        {!value && (
          <InputLabel htmlFor={id} error={error}>
            Select a video file
          </InputLabel>
        )}
        <OutlinedInput
          type="text"
          value={value?.name ?? ""}
          sx={{ pointerEvents: "none" }}
          error={error}
          endAdornment={
            <InputAdornment position="end">
              <Iconify
                icon="eva-upload-outline"
                fontSize={24}
                color={error ? "error.main" : undefined}
              />
            </InputAdornment>
          }
        />
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </FormControl>
    </Box>
  )
})

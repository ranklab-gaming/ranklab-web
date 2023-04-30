// AvatarSelect.tsx
import React, {
  ChangeEvent,
  forwardRef,
  ReactNode,
  useId,
  useState,
} from "react"
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  styled,
} from "@mui/material"

const StyledImage = styled("img")`
  display: block;
  max-width: 40px;
  max-height: 40px;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
`

interface AvatarSelectProps {
  defaultAvatarUrl?: string
  value?: File
  onChange: (file?: File) => void
  label: string
  error: boolean
  helperText: ReactNode
  endAdornment?: ReactNode
}

export const AvatarSelect = forwardRef<HTMLDivElement, AvatarSelectProps>(
  function (
    {
      defaultAvatarUrl,
      value,
      onChange,
      label,
      error,
      helperText,
      endAdornment,
    },
    ref
  ) {
    const [previewUrl, setPreviewUrl] = useState(defaultAvatarUrl)
    const id = useId().slice(1, -1)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]
        setPreviewUrl(URL.createObjectURL(file))
        onChange(file)
      }
    }

    return (
      <Box sx={{ width: "100%" }} ref={ref}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box width={40} height={40} my={2}>
            {previewUrl ? (
              <StyledImage src={previewUrl} alt="Avatar preview" />
            ) : null}
          </Box>
          <FormControl
            sx={{ width: "100%", cursor: "pointer" }}
            component="label"
            htmlFor={id}
            error={error}
          >
            <input
              id={id}
              style={{ display: "none" }}
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
            {!previewUrl && (
              <InputLabel htmlFor={id} error={error}>
                {label}
              </InputLabel>
            )}
            <OutlinedInput
              type="text"
              value={value ? value.name : previewUrl ? label : ""}
              sx={{ pointerEvents: "none" }}
              error={error}
            />
            {helperText && (
              <FormHelperText error={error}>{helperText}</FormHelperText>
            )}
          </FormControl>
        </Stack>
      </Box>
    )
  }
)

AvatarSelect.displayName = "AvatarSelect"

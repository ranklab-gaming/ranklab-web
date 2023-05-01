// AvatarSelect.tsx
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useId,
  useState,
} from "react"
import { Box, Button, FormControl, Stack, styled } from "@mui/material"
import { Avatar } from "@/components/Avatar"

const StyledImage = styled("img")`
  display: block;
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
`

interface AvatarSelectProps {
  defaultAvatarUrl?: string
  onChange: (file?: File) => void
  onClear: () => void
  userName?: string
}

export const AvatarSelect = forwardRef<HTMLDivElement, AvatarSelectProps>(
  function ({ defaultAvatarUrl, onChange, onClear, userName }, ref) {
    const [previewUrl, setPreviewUrl] = useState(defaultAvatarUrl)
    const id = useId().slice(1, -1)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]
        setPreviewUrl(URL.createObjectURL(file))
        onChange(file)
      }
    }

    useEffect(() => {
      setPreviewUrl(defaultAvatarUrl)
    }, [defaultAvatarUrl])

    return (
      <Box ref={ref}>
        <Stack spacing={1} alignItems="center">
          {previewUrl ? (
            <Box width={48} height={48}>
              <StyledImage src={previewUrl} alt="Avatar preview" />
            </Box>
          ) : userName ? (
            <Avatar user={{ name: userName }} sx={{ width: 48, height: 48 }} />
          ) : null}
          {previewUrl ? (
            <Button
              variant="text"
              onClick={() => {
                setPreviewUrl(defaultAvatarUrl)
                onClear()
              }}
              size="small"
            >
              Clear
            </Button>
          ) : (
            <FormControl
              sx={{
                cursor: "pointer",
              }}
              component="label"
              htmlFor={id}
            >
              <input
                id={id}
                style={{ display: "none" }}
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
              <Button
                variant="text"
                size="small"
                type="button"
                sx={{ pointerEvents: "none" }}
              >
                Upload
              </Button>
            </FormControl>
          )}
        </Stack>
      </Box>
    )
  }
)

AvatarSelect.displayName = "AvatarSelect"

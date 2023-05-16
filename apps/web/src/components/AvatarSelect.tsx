// AvatarSelect.tsx
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useId,
  useState,
} from "react"
import { Box, Button, FormControl, Stack, styled } from "@mui/material"
import { Iconify } from "@/components/Iconify"

const StyledImage = styled("img")`
  display: block;
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
`

interface AvatarSelectProps {
  defaultAvatarUrl?: string
  onChange: (file?: File) => void
  onClear: () => void
}

export const AvatarSelect = forwardRef<HTMLDivElement, AvatarSelectProps>(
  function ({ defaultAvatarUrl, onChange, onClear }, ref) {
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
        <Stack alignItems="center">
          {previewUrl ? (
            <Box width={64} height={64}>
              <StyledImage src={previewUrl} alt="Avatar preview" />
            </Box>
          ) : (
            <Box
              width={64}
              height={64}
              sx={{
                bgcolor: "grey.500",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                p: 1,
              }}
            >
              <Iconify
                icon="eva:person-fill"
                fontSize="64px"
                color="grey.300"
              />
            </Box>
          )}
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
                sx={{ pointerEvents: "none", whiteSpace: "nowrap" }}
              >
                Select
              </Button>
            </FormControl>
          )}
        </Stack>
      </Box>
    )
  }
)

AvatarSelect.displayName = "AvatarSelect"

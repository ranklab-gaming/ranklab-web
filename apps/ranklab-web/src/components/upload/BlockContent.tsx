// @mui
import { Box, Typography, Stack } from "@mui/material"
import { Coach } from "@ranklab/api"
// assets
import { UploadIllustration } from "../../assets"

// ----------------------------------------------------------------------

export default function BlockContent({ coach }: { coach: Coach }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", md: "row" }}
      sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Upload VOD for {coach.name}
        </Typography>
      </Box>
    </Stack>
  )
}

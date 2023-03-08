import { Box, Typography, Stack } from "@mui/material"

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", md: "row" }}
      sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
    >
      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Upload VOD
        </Typography>
      </Box>
    </Stack>
  )
}

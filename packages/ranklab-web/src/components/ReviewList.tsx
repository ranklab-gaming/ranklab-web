// material
import { Box } from "@mui/material"
import React from "react"

// function RenderStatus(getStatus: string) {
//   return (
//     <Label
//       variant="filled"
//       color={
//         (getStatus === "busy" && "error") ||
//         (getStatus === "away" && "warning") ||
//         "success"
//       }
//       sx={{ textTransform: "capitalize", mx: "auto" }}
//     >
//       {getStatus}
//     </Label>
//   )
// }

export default function ReviewList() {
  return (
    <Box
      sx={{
        pt: 6,
        pb: 1,
        mb: 10,
        bgcolor: "grey.800",
      }}
    ></Box>
  )
}

import { FileRejection } from "react-dropzone"
import { alpha } from "@mui/material/styles"
import { Box, Paper, Typography } from "@mui/material"
import { CustomFile } from "@/components/FileUpload"
import numeral from "numeral"

export function fData(number: string | number) {
  return numeral(number).format("0.0 b")
}

function getFileData(file: CustomFile | string, index?: number) {
  if (typeof file === "string") {
    return {
      key: index ? `${file}-${index}` : file,
      preview: file,
    }
  }

  return {
    key: index ? `${file.name}-${index}` : file.name,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  }
}

type Props = {
  fileRejections: FileRejection[]
}

export default function RejectionFiles({ fileRejections }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: "error.light",
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = getFileData(file)

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ""}
            </Typography>

            {errors.map((error) => (
              <Box
                key={error.code}
                component="li"
                sx={{ typography: "caption" }}
              >
                {error.message}
              </Box>
            ))}
          </Box>
        )
      })}
    </Paper>
  )
}

import { ReactNode } from "react"
import { DropzoneOptions } from "react-dropzone"
// @mui
import { SxProps } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { Coach } from "@ranklab/api"

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string
  preview?: string
  lastModifiedDate?: Date
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean
  file: CustomFile | string | null
  helperText?: ReactNode
  sx?: SxProps<Theme>
  coach: Coach
}

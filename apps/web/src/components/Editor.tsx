import { Box, Paper, Skeleton, Stack } from "@mui/material"
import { styled, SxProps } from "@mui/material/styles"
import dynamic from "next/dynamic"
import { ReactNode, useId } from "react"
import { ReactQuillProps } from "react-quill"
import { Toolbar } from "./Editor/Toolbar"

import "react-quill/dist/quill.snow.css"

const formats = [
  "align",
  "background",
  "blockquote",
  "bold",
  "bullet",
  "code",
  "code-block",
  "color",
  "direction",
  "font",
  "formula",
  "header",
  "image",
  "indent",
  "italic",
  "link",
  "list",
  "script",
  "size",
  "strike",
  "table",
  "underline",
  "video",
]

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Paper
      sx={{
        p: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Stack spacing={1} height="100%">
        <Skeleton animation="wave" variant="rectangular" height={40} />
        <Skeleton animation="wave" variant="rectangular" height={210} />
      </Stack>
    </Paper>
  ),
})

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  minHeight: 250,
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
  "& .quill": {
    height: "100%"
  },
  "& .ql-container.ql-snow": {
    borderColor: "transparent",
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: 200,
    maxHeight: 640,
    "&.ql-blank::before": {
      fontStyle: "normal",
      color: theme.palette.text.disabled,
    },
    "& pre.ql-syntax": {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}))

export interface Props extends ReactQuillProps {
  error?: boolean
  simple?: boolean
  helperText?: ReactNode
  sx?: SxProps
  placeholder?: string
  vertical?: boolean
}

export const Editor = ({
  error,
  value,
  onChange,
  placeholder,
  helperText,
  vertical = true,
  sx,
  ...other
}: Props) => {
  const id = `editor-${useId().slice(1, -1)}`

  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    clipboard: {
      matchVisual: false,
    },
  }

  return (
    <Box
      sx={{
        ...(vertical && {
          height: "100%",
        }),
      }}
    >
      <RootStyle
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...(vertical && {
            height: "100%",
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} />
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          {...other}
        />
      </RootStyle>

      {helperText}
    </Box>
  )
}

import { Box, BoxProps } from "@mui/material"
import { styled } from "@mui/material/styles"
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
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        bgcolor: "background.paper",
      }}
    >
      Loading...
    </Box>
  ),
})

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
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
  sx?: BoxProps
  placeholder?: string
}

export function Editor({
  error,
  value,
  onChange,
  placeholder,
  helperText,
  sx,
  ...other
}: Props) {
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
    <div>
      <RootStyle
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
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
    </div>
  )
}

import { EditorProps } from "react-draft-wysiwyg"
// next
import dynamic from "next/dynamic"
// material
import { BoxProps } from "@mui/material"
//
import { toolbarFull, toolbarSimple } from "./DraftEditorToolbar"
import DraftEditorStyle from "./DraftEditorStyle"

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
) as React.ElementType

// ----------------------------------------------------------------------

interface DraftEditorProps extends EditorProps {
  simple?: boolean
  sx?: BoxProps
  error?: boolean
}

export default function DraftEditor({
  simple = false,
  sx,
  error = false,
  ...other
}: DraftEditorProps) {
  return (
    <DraftEditorStyle
      sx={{
        ...(error && {
          border: (theme) => `solid 1px ${theme.palette.error.main}`,
        }),
        ...sx,
      }}
    >
      <Editor
        toolbar={simple ? toolbarSimple : toolbarFull}
        placeholder="Write something awesome..."
        {...other}
      />
    </DraftEditorStyle>
  )
}

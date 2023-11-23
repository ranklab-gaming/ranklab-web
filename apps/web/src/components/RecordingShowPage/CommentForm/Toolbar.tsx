import { Iconify } from "@/components/Iconify"
import { Stack, IconButton, useTheme, Tooltip } from "@mui/material"
import { DrawingRef } from "../Drawing"
import { useReview } from "@/hooks/useReview"
import { colors } from "@/contexts/ReviewContext"
import { ConfirmationButton } from "@/components/ConfirmationButton"

export interface ToolbarProps {
  drawingRef: React.RefObject<DrawingRef>
}

export const Toolbar = ({ drawingRef }: ToolbarProps) => {
  const theme = useTheme()
  const { color, setColor, selectedComment, deleteComment } = useReview()

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      mb={1}
      bgcolor="grey.900"
      borderRadius={1}
      p={1}
      sx={{ overflowX: "auto" }}
    >
      {selectedComment ? (
        <Tooltip title="Delete">
          <ConfirmationButton
            action={deleteComment}
            buttonIcon={
              <Iconify icon="mdi:trash-can-outline" width={22} fontSize={22} />
            }
            dialogContentText="Are you sure you want to delete this comment?"
            dialogTitle="Delete Comment"
          />
        </Tooltip>
      ) : null}
      <Tooltip title="Undo">
        <IconButton onClick={() => drawingRef.current?.undo()}>
          <Iconify icon="mdi:undo" width={22} fontSize={22} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Clear">
        <IconButton onClick={() => drawingRef.current?.clear()}>
          <Iconify icon="mdi:eraser" width={22} fontSize={22} />
        </IconButton>
      </Tooltip>
      {colors.map((c) => (
        <IconButton
          key={c}
          onClick={() => {
            setColor(c)
          }}
          sx={{
            color: theme.palette[c].main,
            ...(color === c && {
              backgroundColor: theme.palette.background.paper,
            }),
          }}
        >
          <Iconify icon="mdi:circle" width={22} fontSize={22} />
        </IconButton>
      ))}
    </Stack>
  )
}

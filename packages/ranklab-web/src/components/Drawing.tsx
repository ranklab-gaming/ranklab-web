import { FunctionComponent, useEffect } from "react"
import { Box } from "@mui/material"
import { useSvgDrawing } from "@ranklab-gaming/svg-drawing-react"

interface Props {
  onChange: (svg: string) => void
}

const Drawing: FunctionComponent<Props> = ({ onChange }) => {
  const [drawingRef, draw] = useSvgDrawing({
    penWidth: 5,
    penColor: "red",
    delay: 100,
  })

  useEffect(() => {
    onChange(draw.getSvgXML() ?? "")
  }, [draw.getSvgXML()])

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      ref={drawingRef}
    />
  )
}

export default Drawing

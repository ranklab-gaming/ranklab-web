import { FunctionComponent, useEffect } from "react"
import { Box } from "@mui/material"
import { useSvgDrawing } from "@ranklab-gaming/svg-drawing-react"

interface Props {
  onChange: (svg: string) => void
  value: string
}

const Drawing: FunctionComponent<Props> = ({ onChange, value }) => {
  const [drawingRef, draw] = useSvgDrawing({
    penWidth: 5,
    penColor: "red",
    delay: 100,
  })

  useEffect(() => {
    draw.ref.current?.svg.parseSVGString(value)
  }, [value])

  useEffect(() => {
    onChange(draw.getSvgXML() ?? "")
  }, [draw.getSvgXML()])

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      ref={drawingRef}
    />
  )
}

export type { Drawing as DrawingType }
export default Drawing

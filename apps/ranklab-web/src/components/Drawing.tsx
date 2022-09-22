import {
  ForwardedRef,
  FunctionComponent,
  useEffect,
  useImperativeHandle,
} from "react"
import { Box } from "@mui/material"
import { UseSvgDrawing, useSvgDrawing } from "@svg-drawing/react"

if (window.TouchEvent === undefined) {
  window["TouchEvent"] = (() => {}) as any
}

export interface DrawingProps {
  onChange: (svg: string) => void
  value: string
  penColor: string
  drawingRef?: ForwardedRef<UseSvgDrawing>
}

const Drawing: FunctionComponent<DrawingProps> = ({
  onChange,
  value,
  penColor,
  drawingRef: ref,
}) => {
  const [drawingRef, draw] = useSvgDrawing({
    penWidth: 3,
    penColor,
    delay: 100,
  })

  useImperativeHandle(ref, () => draw)

  useEffect(() => {
    draw.ref.current?.svg.parseSVGString(value || "<svg></svg>")
    draw.ref.current?.update()
  }, [value])

  useEffect(() => {
    onChange(draw.getSvgXML() ?? "")
  }, [draw.getSvgXML()])

  useEffect(() => {
    draw.changePenColor(penColor)
  }, [penColor])

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: "url(/static/edit.png) 0 16, auto",
      }}
      ref={drawingRef}
    />
  )
}

type DrawingType = typeof Drawing

export type { DrawingType }
export default Drawing

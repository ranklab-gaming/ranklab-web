import { assetsCdnUrl } from "@/config"
import { useReview } from "@/hooks/useReview"
import { Box, useTheme } from "@mui/material"
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react"

export interface DrawingRef {
  clear: () => void
  undo: () => void
}

interface Point {
  x: number
  y: number
}

const getPointFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
  const svg = e.currentTarget.querySelector("svg")

  if (!svg) {
    return { x: 0, y: 0 }
  }

  const rect = svg.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  return { x, y }
}

export const Drawing = forwardRef<DrawingRef>((_, ref) => {
  const theme = useTheme()
  const pathRef = useRef<SVGPathElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pointRef = useRef<Point | null>(null)
  const mousePositionRef = useRef<Point | null>(null)
  const { color, form } = useReview()
  const drawing = form.watch("metadata.video.drawing")

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let svg = container.querySelector("svg")

    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      container.appendChild(svg)
      form.setValue("metadata.video.drawing", container.innerHTML)
    }
  }, [form])

  useImperativeHandle(ref, () => ({
    clear: () => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const svg = container.querySelector("svg")

      if (!svg) {
        return
      }

      svg.querySelectorAll("path").forEach((path) => path.remove())
      form.setValue("metadata.video.drawing", container.innerHTML)
    },
    undo: () => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const svg = container.querySelector("svg")

      if (!svg) {
        return
      }

      svg.querySelector("path:last-child")?.remove()
      form.setValue("metadata.video.drawing", container.innerHTML)
    },
  }))

  const drawPoint = () => {
    const path = pathRef.current
    const mousePosition = mousePositionRef.current
    const point = pointRef.current

    if (!path || !mousePosition) {
      return
    }

    const { x, y } = mousePosition

    if (point && point.x === x && point.y === y) {
      return
    }

    path.setAttribute("d", `${path.getAttribute("d")} L ${x} ${y}`)
    pointRef.current = { x, y }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mousePositionRef.current = getPointFromEvent(e)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const svg = container.querySelector("svg")

    if (!svg) {
      return
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    const { x, y } = getPointFromEvent(e)

    path.setAttribute("stroke", theme.palette[color].main)
    path.setAttribute("fill", "none")
    path.setAttribute("stroke-linecap", "round")
    path.setAttribute("stroke-linejoin", "round")
    path.setAttribute("stroke-width", "3")
    path.setAttribute("d", `M ${x} ${y}`)
    svg.appendChild(path)

    pathRef.current = path
    timeoutRef.current = setInterval(drawPoint, 100)
  }

  const handleMouseUp = () => {
    const timeout = timeoutRef.current
    const container = containerRef.current

    pathRef.current = null

    if (timeout) {
      clearTimeout(timeout)
      timeoutRef.current = null
    }

    if (!container) {
      return
    }

    form.setValue("metadata.video.drawing", container.innerHTML)
  }

  return (
    <Box
      title="Drawing"
      sx={{
        "& svg": {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: `url(${assetsCdnUrl}/images/cursors/draw.webp) 0 15, auto`,
          zIndex: 10,
        },
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: drawing }}
      />
    </Box>
  )
})

Drawing.displayName = "Drawing"

export default Drawing

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
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height

  return { x, y }
}

export const Drawing = forwardRef<DrawingRef>((_, ref) => {
  const theme = useTheme()
  const pathRef = useRef<SVGPathElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pointRef = useRef<Point | null>(null)
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
      svg.setAttribute("viewBox", "0 0 1 1")
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const path = pathRef.current
    const point = pointRef.current
    const mousePosition = getPointFromEvent(e)

    if (!path || !mousePosition || !point) {
      return
    }

    const { x, y } = mousePosition

    if (point.x === x && point.y === y) {
      return
    }

    path.setAttribute("d", `${path.getAttribute("d")} L ${x} ${y}`)

    pointRef.current = { x, y }
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
    const point = getPointFromEvent(e)
    const { x, y } = point

    path.setAttribute("stroke", theme.palette[color].main)
    path.setAttribute("fill", "none")
    path.setAttribute("stroke-linecap", "round")
    path.setAttribute("stroke-linejoin", "round")
    path.setAttribute("stroke-width", "0.003")
    path.setAttribute("d", `M ${x} ${y}`)
    svg.appendChild(path)

    pathRef.current = path
    pointRef.current = point
  }

  const handleMouseUp = () => {
    const container = containerRef.current

    pathRef.current = null
    pointRef.current = null

    if (!container) {
      return
    }

    form.setValue("metadata.video.drawing", container.innerHTML)
  }

  return (
    <Box
      sx={{
        "& svg": {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
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

import { assetsCdnUrl } from "@/config"
import { useReview } from "@/hooks/useReview"
import { Box, useTheme } from "@mui/material"
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
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
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 1280
  const y = ((e.clientY - rect.top) / rect.height) * 720

  return { x, y }
}

export const Drawing = forwardRef<DrawingRef>((_, ref) => {
  const theme = useTheme()
  const pathRef = useRef<SVGPathElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pointRef = useRef<Point | null>(null)
  const { color, form } = useReview()
  const drawing = form.watch("metadata.video.drawing")

  const handleChange = useCallback(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const svg = container.querySelector("svg")

    if (!svg) {
      return
    }

    let value

    if (svg.querySelectorAll("path").length === 0) {
      value = ""
    } else {
      value = container.innerHTML
    }

    form.setValue("metadata.video.drawing", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }, [form])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let svg = container.querySelector("svg")

    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("viewBox", "0 0 1280 720")
      container.appendChild(svg)
    }
  }, [])

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
      handleChange()
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
      handleChange()
    },
  }))

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const path = pathRef.current
    const point = pointRef.current
    const { x, y } = getPointFromEvent(e)

    if (!path || !point) {
      return
    }

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
    path.setAttribute("stroke-width", "3")
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

    handleChange()
  }

  return (
    <Box
      aria-label="Drawing"
      width="100%"
      height="100%"
      position="absolute"
      left="0"
      top="0"
      sx={{
        "& svg": {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          cursor: `url(${assetsCdnUrl}/images/cursors/draw.webp) 0 15, auto`,
        },
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={containerRef}
        style={{
          position: "relative",
          height: "100%",
        }}
        dangerouslySetInnerHTML={{ __html: drawing }}
      />
    </Box>
  )
})

Drawing.displayName = "Drawing"

export default Drawing

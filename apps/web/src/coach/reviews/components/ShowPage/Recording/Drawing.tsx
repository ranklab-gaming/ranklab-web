import { animateFade } from "@/animate/fade"
import { useSvgDrawing } from "@svg-drawing/react"
import { m } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Color } from "../Recording"
import { Box, useTheme } from "@mui/material"
import drawCursor from "@/images/cursors/draw.png"

interface DrawingProps {
  color: Color
  value: string
  onChange: (value: string) => void
}

export interface DrawingRef {
  changeColor: (color: Color) => void
  clear: () => void
  undo: () => void
}

export const Drawing = forwardRef<DrawingRef, DrawingProps>(
  ({ color, value, onChange }, ref) => {
    const theme = useTheme()
    const shouldDisableChange = useRef(false)

    const [renderRef, draw] = useSvgDrawing({
      penWidth: 3,
      penColor: theme.palette[color].main,
      delay: 100,
    })

    function getSvgXml() {
      const svg = draw.getSvgXML() || "<svg></svg>"
      const svgElement = new DOMParser().parseFromString(svg, "image/svg+xml")

      if (svgElement.documentElement.childElementCount === 0) {
        return ""
      }

      const width = svgElement.documentElement.getAttribute("width")
      const height = svgElement.documentElement.getAttribute("height")

      svgElement.documentElement.removeAttribute("height")
      svgElement.documentElement.removeAttribute("width")

      svgElement.documentElement.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
      )

      return svgElement.documentElement.outerHTML
    }

    useEffect(() => {
      if (shouldDisableChange.current) {
        shouldDisableChange.current = false
        return
      }

      if (value !== getSvgXml()) {
        draw.ref.current?.svg.parseSVGString(value || "<svg></svg>")
        draw.ref.current?.update()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
      const initObserver = () => {
        const callback = () => {
          const svg = getSvgXml()

          if (svg !== value) {
            shouldDisableChange.current = true
            onChange(svg)
          }
        }

        const observer = new MutationObserver(callback)

        if (renderRef.current) {
          observer.observe(renderRef.current, {
            attributes: true,
            childList: true,
            subtree: true,
          })
        }

        return () => observer.disconnect()
      }

      const cleanup = initObserver()

      return () => cleanup()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => ({
      changeColor: (color: Color) => {
        draw.changePenColor(theme.palette[color].main)
      },
      clear: () => {
        draw.clear()
      },
      undo: () => {
        draw.undo()
      },
    }))

    return (
      <Box
        component={m.div}
        variants={animateFade().in}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div
          ref={renderRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: `url(${drawCursor.src}) 0 15, auto`,
            zIndex: 10,
          }}
        />
      </Box>
    )
  }
)

Drawing.displayName = "Drawing"

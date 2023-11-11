import { animateFade } from "@/animate/fade"
import { useSvgDrawing } from "@svg-drawing/react"
import { m } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Box, useTheme } from "@mui/material"
import { Color } from "@/contexts/ReviewContext"
import { useReview } from "@/hooks/useReview"
import { assetsCdnUrl } from "@/config"

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.TouchEvent = window.TouchEvent || function TouchEvent() {}
}

export interface DrawingRef {
  changeColor: (color: Color) => void
  clear: () => void
  undo: () => void
}

export const Drawing = forwardRef<DrawingRef>((_props, ref) => {
  const theme = useTheme()
  const { color, form, metadataController } = useReview()
  const metadata = form.watch("metadata")
  const value = metadata.video.drawing

  const [renderRef, draw] = useSvgDrawing({
    penWidth: 3,
    penColor: theme.palette[color].main,
    delay: 100,
  })

  const getSvgXml = () => {
    const svg = draw.getSvgXML() || "<svg></svg>"
    const svgElement = new DOMParser().parseFromString(svg, "image/svg+xml")

    if (svgElement.documentElement.childElementCount === 0) {
      return ""
    }

    const width = svgElement.documentElement.getAttribute("width")
    const height = svgElement.documentElement.getAttribute("height")

    svgElement.documentElement.removeAttribute("height")
    svgElement.documentElement.removeAttribute("width")

    if (!width || !height) {
      return null
    }

    svgElement.documentElement.setAttribute("viewBox", `0 0 ${width} ${height}`)

    return svgElement.documentElement.outerHTML
  }

  useEffect(() => {
    if (value !== getSvgXml()) {
      draw.ref.current?.svg.parseSVGString(value || "<svg></svg>")
      draw.ref.current?.update()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const svg = getSvgXml()

      if (svg !== null && svg !== value) {
        metadataController.field.onChange({
          ...metadata,
          video: {
            ...metadata.video,
            drawing: svg,
          },
        })
      }
    })

    if (renderRef.current) {
      observer.observe(renderRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      })
    }

    return () => observer.disconnect()
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
        title="Drawing"
        ref={renderRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: `url(${assetsCdnUrl}/images/cursors/draw.webp) 0 15, auto`,
          zIndex: 10,
        }}
      />
    </Box>
  )
})

Drawing.displayName = "Drawing"

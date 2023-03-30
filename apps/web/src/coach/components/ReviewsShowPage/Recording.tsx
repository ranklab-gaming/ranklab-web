import { CommentFormValues } from "@/coach/components/ReviewsShowPage"
import { Iconify } from "@/components/Iconify"
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  useTheme,
} from "@mui/material"
import { Recording as ApiRecording } from "@ranklab/api"
import { m } from "framer-motion"
import {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { UseFormReturn } from "react-hook-form"
import { useSvgDrawing } from "@svg-drawing/react"
import drawCursor from "@/images/cursors/draw.png"
import { animateFade } from "@/animate/fade"

if (typeof window !== "undefined") {
  window.TouchEvent = window.TouchEvent || Object.create(Event)
}

interface Props {
  recording: ApiRecording
  onTimeUpdate: (time: number) => void
  videoRef?: RefObject<VideoPlayerRef>
  editing: boolean
  form: UseFormReturn<CommentFormValues>
}

const colors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

type Color = (typeof colors)[number]

interface DrawingProps {
  color: Color
  value: string
  onChange: (value: string) => void
}

interface DrawingRef {
  changeColor: (color: Color) => void
  clear: () => void
}

const Drawing = forwardRef<DrawingRef, DrawingProps>(
  ({ color, value, onChange }, ref) => {
    const theme = useTheme()

    const [renderRef, draw] = useSvgDrawing({
      penWidth: 2,
      penColor: theme.palette[color].main,
      delay: 100,
    })

    useEffect(() => {
      draw.ref.current?.svg.parseSVGString(value || "<svg></svg>")
      draw.ref.current?.update()
    }, [draw.ref, value])

    useEffect(() => {
      const svg = draw.getSvgXML() || "<svg></svg>"
      const svgElement = new DOMParser().parseFromString(svg, "image/svg+xml")
      const width = svgElement.documentElement.getAttribute("width")
      const height = svgElement.documentElement.getAttribute("height")

      svgElement.documentElement.removeAttribute("height")
      svgElement.documentElement.removeAttribute("width")

      svgElement.documentElement.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
      )

      onChange(svgElement.documentElement.outerHTML)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draw.getSvgXML()])

    useImperativeHandle(ref, () => ({
      changeColor: (color: Color) => {
        draw.changePenColor(theme.palette[color].main)
      },
      clear: () => {
        draw.clear()
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
            cursor: `url(${drawCursor.src}) 0 16, auto`,
            zIndex: 10,
          }}
        />
      </Box>
    )
  }
)

Drawing.displayName = "Drawing"

export const Recording = ({
  recording,
  onTimeUpdate,
  videoRef,
  editing,
  form,
}: Props) => {
  const theme = useTheme()
  const [color, setColor] = useState<Color>("primary")
  const drawing = form.watch("drawing")
  const drawingRef = useRef<DrawingRef>(null)

  return (
    <Stack spacing={2}>
      {editing ? (
        <Box
          component={m.div}
          key="color"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animateFade().in}
          position="absolute"
          top={theme.spacing(1)}
          left={theme.spacing(1)}
        >
          <SpeedDial
            direction="right"
            ariaLabel="Color"
            FabProps={{
              size: "small",
              color,
            }}
            sx={{
              "& .MuiSpeedDial-actions": {
                pl: 5,
              },
            }}
            icon={
              <SpeedDialIcon
                openIcon={
                  <Iconify icon="eva:brush-outline" height={24} fontSize={24} />
                }
                icon={
                  <Iconify icon="eva:brush-outline" height={24} fontSize={24} />
                }
                sx={{
                  "& .MuiSpeedDialIcon-openIcon": {
                    transform: "none",
                    transition: "none",
                  },
                  "& .MuiSpeedDialIcon-icon": {
                    transform: "none",
                    transition: "none",
                  },
                }}
              />
            }
          >
            {colors.map((color, index) => (
              <SpeedDialAction
                key={index}
                sx={{
                  color: (theme) => theme.palette.common.white,
                  bgcolor: (theme) => theme.palette[color].main,
                  "&:hover": {
                    bgcolor: (theme) => theme.palette[color].dark,
                  },
                }}
                onClick={() => {
                  setColor(color)
                  drawingRef.current?.changeColor(color)
                }}
              />
            ))}
            <SpeedDialAction
              icon={
                <Iconify icon="eva:trash-2-outline" height={24} fontSize={24} />
              }
              onClick={() => {
                drawingRef.current?.clear()
              }}
            />
          </SpeedDial>
        </Box>
      ) : null}
      <Box
        height="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box position="relative">
          {editing ? (
            <Drawing
              color={color}
              ref={drawingRef}
              value={drawing}
              onChange={(value) => form.setValue("drawing", value)}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: drawing }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            />
          )}
          <VideoPlayer
            src={`${uploadsCdnUrl}/${recording.videoKey}`}
            type={recording.mimeType}
            onTimeUpdate={onTimeUpdate}
            ref={videoRef}
            controls={!editing}
          />
        </Box>
      </Box>
    </Stack>
  )
}

import {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

interface Props {
  pgn: string
  playerColor: "white" | "black"
  allowNavigation?: boolean
  drawArrows?: boolean
  onMove?: (move: any) => void
  onSideResize?: (dimensions: { width: number; height: number }) => void
  onShapesChange?: (shapes: any) => void
}

export interface ChessBoardRef {
  move: (move: any) => void
  setShapes: (shapes: any) => void
}

export const ChessBoard = forwardRef<ChessBoardRef, PropsWithChildren<Props>>(
  (
    {
      pgn,
      onMove,
      playerColor,
      onSideResize,
      onShapesChange,
      drawArrows = false,
      allowNavigation = true,
      children,
    },
    ref
  ) => {
    const url =
      process.env.NODE_ENV === "development"
        ? "http://ranklab-web:8080"
        : "https://chess.ranklab.gg"

    const [showIframe, setShowIframe] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useImperativeHandle(ref, () => ({
      move: (move: any) => {
        iframeRef.current?.contentWindow?.postMessage?.(
          {
            type: "move",
            move,
          },
          "*"
        )
      },
      setShapes: (shapes: any) => {
        iframeRef.current?.contentWindow?.postMessage?.(
          {
            type: "setShapes",
            shapes,
          },
          "*"
        )
      },
    }))

    useEffect(() => {
      function handleMessage(event: any) {
        if (event.data.type === "move") {
          onMove?.(event.data.move)
        }

        if (event.data.type === "sideResize") {
          onSideResize?.(event.data.dimensions)
        }

        if (event.data.type === "ready") {
          iframeRef.current?.contentWindow?.postMessage?.(
            {
              type: "loadPgn",
              pgn: pgn,
              orientation: playerColor,
              drawArrows: drawArrows,
            },
            "*"
          )
        }

        if (event.data.type === "shapesChange") {
          onShapesChange?.(event.data.shapes)
        }
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (!allowNavigation) {
          return
        }

        if (event.key === "ArrowLeft") {
          iframeRef.current?.contentWindow?.postMessage?.(
            { type: "goToPrev" },
            "*"
          )
        }

        if (event.key === "ArrowRight") {
          iframeRef.current?.contentWindow?.postMessage?.(
            { type: "goToNext" },
            "*"
          )
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("message", handleMessage)

      setShowIframe(true)

      return () => {
        window.removeEventListener("message", handleMessage)
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [
      allowNavigation,
      drawArrows,
      onMove,
      onShapesChange,
      onSideResize,
      pgn,
      playerColor,
    ])

    return showIframe ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          ref={iframeRef}
        />
        {children}
      </div>
    ) : null
  }
)

ChessBoard.displayName = "ChessBoard"

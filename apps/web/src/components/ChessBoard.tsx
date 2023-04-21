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
  onMove?: (move: any) => void
  onSideResize?: (dimensions: { width: number; height: number }) => void
}

export interface ChessBoardRef {
  move: (move: any) => void
}

export const ChessBoard = forwardRef<ChessBoardRef, PropsWithChildren<Props>>(
  ({ pgn, onMove, playerColor, onSideResize, children }, ref) => {
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
              playerColor: playerColor,
            },
            "*"
          )
        }
      }

      window.addEventListener("message", handleMessage)

      setShowIframe(true)

      return () => {
        window.removeEventListener("message", handleMessage)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

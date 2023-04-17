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
  onMove?: (move: any) => void
}

export interface ChessBoardRef {
  move: (move: any) => void
}

export const ChessBoard = forwardRef<ChessBoardRef, PropsWithChildren<Props>>(
  ({ pgn, onMove, children }, ref) => {
    const url =
      process.env.NODE_ENV === "development"
        ? "http://ranklab-web:8080"
        : "https://chess.ranklab.gg"

    const [showIframe, setShowIframe] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useImperativeHandle(ref, () => ({
      move: (move: any) => {
        iframeRef.current?.contentWindow?.postMessage(
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

        if (event.data.type === "ready") {
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: "loadPgn",
              pgn: pgn,
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
          height="700"
          frameBorder="0"
          ref={iframeRef}
        />
        {children}
      </div>
    ) : null
  }
)

ChessBoard.displayName = "ChessBoard"

import { Box } from "@mui/material"
import { useEffect, useRef, useState } from "react"

interface Props {
  pgn: string
  onPathChange?: (path: string) => void
}

export const ChessBoard = ({ pgn, onPathChange }: Props) => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://ranklab-web:8080"
      : "https://chess.ranklab.gg"

  const [showIframe, setShowIframe] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(event: any) {
      if (event.data.type === "pathChange") {
        onPathChange?.(event.data.path)
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

  return (
    <Box width={"100%"}>
      {showIframe ? (
        <iframe
          src={url}
          width="100%"
          height="700"
          frameBorder="0"
          ref={iframeRef}
        />
      ) : null}
    </Box>
  )
}

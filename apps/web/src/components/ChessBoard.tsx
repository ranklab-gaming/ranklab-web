import { Box } from "@mui/material"
import { useEffect, useRef, useState } from "react"

export const ChessBoard = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://ranklab-web:8080"
      : "https://chess.ranklab.gg"

  const [showIframe, setShowIframe] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(event: any) {
      if (event.data.type === "shapes") {
        console.log(event.data.shapes)
      }

      if (event.data.type === "move") {
        console.log(event.data.move)
      }

      if (event.data.type === "ready") {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "loadPgn",
            pgn: "e4",
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
    <Box>
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

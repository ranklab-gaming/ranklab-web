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
        setTimeout(() => {
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: "loadPgn",
              pgn: `[Event "Rated Rapid game"]
            [Site "https://lichess.org/SRMYL2iO"]
            [Date "2022.12.12"]
            [White "nemesys0"]
            [Black "Jagab"]
            [Result "1-0"]
            [UTCDate "2022.12.12"]
            [UTCTime "12:49:48"]
            [WhiteElo "1665"]
            [BlackElo "1734"]
            [WhiteRatingDiff "+8"]
            [BlackRatingDiff "-7"]
            [Variant "Standard"]
            [TimeControl "600+0"]
            [ECO "B12"]
            [Opening "Caro-Kann Defense: Advance Variation, Botvinnik-Carls Defense"]
            [Termination "Normal"]
            [Annotator "lichess.org"]

            1. e4 { [%eval 0.36] [%clk 0:10:00] } 1... c6 { [%eval 0.37] [%clk 0:10:00] } 2. d4 { [%eval 0.41] [%clk 0:09:57] } 2... d5 { [%eval 0.28] [%clk 0:10:00] } 3. e5 { [%eval 0.28] [%clk 0:09:57] } 3... c5 { [%eval 0.44] [%clk 0:09:54] } { B12 Caro-Kann Defense: Advance Variation, Botvinnik-Carls Defense } 4. dxc5 { [%eval 0.5] [%clk 0:09:55] } 4... a6 { [%eval 0.94] [%clk 0:09:50] } 5. Nc3 { [%eval 0.59] [%clk 0:09:14] } 5... Nc6?? { (0.59 → 3.29) Blunder. e6 was best. } { [%eval 3.29] [%clk 0:09:46] } (5... e6 6. Na4 Nd7 7. Nf3 Nxc5 8. Nxc5 Bxc5 9. Bd3 Bd7 10. a4) 6. f4?? { (3.29 → 0.97) Blunder. Nxd5 was best. } { [%eval 0.97] [%clk 0:09:05] } (6. Nxd5 Bf5 7. Be3 Nxe5 8. Bf4 Bxc2 9. Qxc2 Qxd5 10. Rd1 Qe6) 6... h6?! { (0.97 → 1.98) Inaccuracy. e6 was best. } { [%eval 1.98] [%clk 0:09:23] } (6... e6 7. Na4 Nxe5 8. Nb6 Bxc5 9. Nxa8 Nc6 10. Bd3 Bd7 11. Qe2 Qxa8 12. Be3 Nd4 13. Bxd4) 7. Nxd5 { [%eval 2.04] [%clk 0:08:42] } 7... Qa5+? { (2.04 → 3.83) Mistake. Bg4 was best. } { [%eval 3.83] [%clk 0:08:44] } (7... Bg4 8. Qd2 e6 9. Ne3 Bh5 10. b4 g5 11. Nh3 Bg6 12. c3 Qxd2+ 13. Bxd2 a5 14. a4) 8. Bd2 { [%eval 3.64] [%clk 0:07:32] } 8... Qxc5?? { (3.64 → 8.12) Blunder. Qd8 was best. } { [%eval 8.12] [%clk 0:08:40] } (8... Qd8 9. Nb6 Rb8 10. Bd3 e6 11. b4 Nge7 12. Nc4 Nd5 13. a3 b6 14. Nd6+ Bxd6 15. cxd6) 9. Nc7+ { [%eval 8.51] [%clk 0:07:30] } { Black resigns. } 1-0

            `,
            },
            "*"
          )
        }, 3000)
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

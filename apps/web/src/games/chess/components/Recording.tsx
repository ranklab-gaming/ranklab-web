import { ChessBoard } from "./ChessBoard"
import { RecordingProps } from "@/games/video/components/Recording"
import { PropsWithChildren } from "react"

const Recording = ({
  recording,
  children,
}: PropsWithChildren<RecordingProps>) => {
  return <ChessBoard recording={recording}>{children}</ChessBoard>
}

export default Recording

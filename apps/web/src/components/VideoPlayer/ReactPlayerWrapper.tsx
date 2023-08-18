import ReactPlayer, { ReactPlayerProps } from "react-player"

export default function ReactPlayerWrapper({
  playerRef,
  ...props
}: ReactPlayerProps & { playerRef?: React.ForwardedRef<ReactPlayer> }) {
  return <ReactPlayer {...props} ref={playerRef} />
}

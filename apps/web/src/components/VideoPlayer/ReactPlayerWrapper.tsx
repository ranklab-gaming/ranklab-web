import ReactPlayer, { ReactPlayerProps } from "react-player"

export default function ReactPlayerWrapper({
  playerRef,
  children,
  ...props
}: ReactPlayerProps & { playerRef?: React.ForwardedRef<ReactPlayer> }) {
  return (
    <>
      {children}
      <ReactPlayer {...props} ref={playerRef} />
    </>
  )
}

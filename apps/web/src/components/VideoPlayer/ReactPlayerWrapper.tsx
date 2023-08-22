import ReactPlayer, { ReactPlayerProps } from "react-player"

const ReactPlayerWrapper = ({
  playerRef,
  children,
  ...props
}: ReactPlayerProps & { playerRef?: React.ForwardedRef<ReactPlayer> }) => {
  return (
    <>
      {children}
      <ReactPlayer {...props} ref={playerRef} />
    </>
  )
}

ReactPlayerWrapper.displayName = "ReactPlayerWrapper"

export default ReactPlayerWrapper

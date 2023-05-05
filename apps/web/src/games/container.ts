import chessContainer from "./chess/container"
import videoContainer from "./video/container"

export type Container = typeof videoContainer

export default { chess: chessContainer, video: videoContainer }

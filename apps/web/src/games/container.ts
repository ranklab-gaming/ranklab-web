import chessContainer from "./chess/container"
import videoContainer from "./video/container"
import overwatchContainer from "./overwatch/container"

export type Container = typeof videoContainer

export default {
  chess: chessContainer,
  video: videoContainer,
  overwatch: overwatchContainer,
}

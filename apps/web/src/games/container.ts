import videoContainer from "./video/container"
import overwatchContainer from "./overwatch/container"

export type Container = typeof videoContainer

export default {
  video: videoContainer,
  overwatch: overwatchContainer,
}

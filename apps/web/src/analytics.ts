import mixpanel from "mixpanel-browser"
import { mixpanelProjectToken } from "./config"

type Mixpanel = typeof mixpanel

export function track(
  ...args: Parameters<Mixpanel["track"]>
): ReturnType<Mixpanel["track"]> {
  if (mixpanelProjectToken) {
    mixpanel.track(...args)
  }
}

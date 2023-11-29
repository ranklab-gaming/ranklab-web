import { AnalyticsContext } from "@/contexts/AnalyticsContext"
import mixpanel from "mixpanel-browser"
import { useContext, useMemo } from "react"

export function useAnalytics() {
  const analytics = useContext(AnalyticsContext)

  if (!analytics) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider")
  }

  return useMemo(() => {
    return {
      track(eventName: string, ...args: any[]) {
        if (analytics.enabled) {
          return mixpanel.track(eventName, ...args)
        }
      },
    }
  }, [analytics.enabled])
}

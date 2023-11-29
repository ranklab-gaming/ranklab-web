import { createContext, PropsWithChildren } from "react"

interface Analytics {
  enabled: boolean
}

interface AnalyticsProviderProps extends PropsWithChildren {
  value: Analytics | null
}

export const AnalyticsContext = createContext<Analytics | null | undefined>(
  null,
)

export const AnalyticsProvider = ({
  children,
  value,
}: AnalyticsProviderProps) => {
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

import { createContext, PropsWithChildren } from "react"

export interface Layout {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

interface LayoutProviderProps extends PropsWithChildren {
  value: Layout
}

export const LayoutContext = createContext<Layout | null | undefined>(null)

export const LayoutProvider = ({ children, value }: LayoutProviderProps) => {
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

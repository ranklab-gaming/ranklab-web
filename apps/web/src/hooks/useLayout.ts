import { LayoutContext } from "@/contexts/LayoutContext"
import { useContext } from "react"

export function useLayout() {
  const layout = useContext(LayoutContext)

  if (!layout) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }

  return layout
}

import { Coach } from "@ranklab/api"
import { ReactNode, createContext } from "react"

interface CoachProviderProps {
  children: ReactNode
  coach: Coach
}

export const CoachContext = createContext<Coach | null | undefined>(null)

export function CoachProvider({ children, coach }: CoachProviderProps) {
  return <CoachContext.Provider value={coach}>{children}</CoachContext.Provider>
}

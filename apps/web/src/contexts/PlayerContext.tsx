import { Player } from "@ranklab/api"
import { ReactNode, createContext } from "react"

interface PlayerProviderProps {
  children: ReactNode
  player: Player
}

export const PlayerContext = createContext<Player | null | undefined>(null)

export function PlayerProvider({ children, player }: PlayerProviderProps) {
  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  )
}

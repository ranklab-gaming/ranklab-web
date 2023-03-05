import { PlayerContext } from "@/contexts/PlayerContext"
import { useContext } from "react"

export default function usePlayer() {
  const player = useContext(PlayerContext)

  if (!player) {
    throw new Error("useUser must be used within a PlayerProvider")
  }

  return player
}

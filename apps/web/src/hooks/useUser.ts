import { CoachContext } from "@/contexts/CoachContext"
import { PlayerContext } from "@/contexts/PlayerContext"
import { useContext } from "react"

export default function useUser() {
  const coach = useContext(CoachContext)
  const player = useContext(PlayerContext)

  if (coach) {
    return coach
  }

  if (player) {
    return player
  }

  throw new Error(
    "useUser must be used within a CoachProvider or PlayerProvider"
  )
}

import { CoachContext } from "@/contexts/CoachContext"
import { useContext } from "react"

export default function useCoach() {
  const coach = useContext(CoachContext)

  if (!coach) {
    throw new Error("useUser must be used within a CoachProvider")
  }

  return coach
}

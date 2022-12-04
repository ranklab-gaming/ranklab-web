import { Coach, Player, UserType } from "@ranklab/api"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

interface CoachUser extends Coach {
  type: "coach"
}

interface PlayerUser extends Player {
  type: "player"
}

export type User = CoachUser | PlayerUser

export default function useUser() {
  const user = useContext(UserContext)

  if (!user) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return user
}

export function useCoach(): Coach {
  const user = useUser()

  if (user.type !== UserType.Coach) {
    throw new Error("useCoach expected a coach user")
  }

  return user
}

export function usePlayer(): Player {
  const user = useUser()

  if (user.type !== UserType.Player) {
    throw new Error("usePlayer expected a player user")
  }

  return user
}

import { Coach, Player, UserType } from "@ranklab/api"
import { signIn } from "next-auth/react"

interface CoachUser extends Coach {
  type: "coach"
}

interface PlayerUser extends Player {
  type: "player"
}

export type User = CoachUser | PlayerUser

export function userFromCoach(coach: Coach): CoachUser {
  return { ...coach, type: "coach" }
}

export function userFromPlayer(player: Player): PlayerUser {
  return { ...player, type: "player" }
}

export async function authenticate(
  userType: UserType,
  intent: "login" | "signup" = "login",
  params: Record<string, string | null> = {}
) {
  return signIn(
    "ranklab",
    { callbackUrl: `/${userType}/dashboard` },
    { user_type: userType, intent, ...params }
  )
}

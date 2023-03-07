import { Coach, Player } from "@ranklab/api"

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

export function coachFromUser(user: User): Coach {
  if (user.type === "coach") {
    return user
  }

  throw new Error("user is not a coach")
}

export function playerFromUser(user: User): Player {
  if (user.type === "player") {
    return user
  }

  throw new Error("user is not a player")
}

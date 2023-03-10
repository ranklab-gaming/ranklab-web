import { Coach, Player } from "@ranklab/api"

export type User = CoachUser | PlayerUser

export interface CoachUser extends Coach {
  type: "coach"
}

export interface PlayerUser extends Player {
  type: "player"
}

export type PropsWithUser<P = {}> = P & {
  user: User
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

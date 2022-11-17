import { Coach, Player } from "@ranklab/api"

export type Pagination = {
  page: number
  perPage: number
  totalPages: number
  count: number
}

interface CoachUser extends Coach {
  type: "coach"
}

interface PlayerUser extends Player {
  type: "player"
}

export type User = CoachUser | PlayerUser

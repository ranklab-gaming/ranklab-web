import { Coach, Player, UserType } from "@ranklab/api"

export type PaginatedResult<T> = {
  records: T[]
  page: number
  perPage: number
  totalPages: number
  count: number
}

export type User<U extends UserType = UserType> = U extends "coach"
  ? Coach
  : Player

import { Coach, Player } from "@ranklab/api"

export type PaginatedResult<T> = {
  records: T[]
  page: number
  perPage: number
  totalPages: number
  count: number
}

export type Account = Coach | Player

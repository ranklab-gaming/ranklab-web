export type PaginatedResult<T> = {
  records: T[]
  page: number
  perPage: number
  totalPages: number
  count: number
}

import { User } from "@ranklab/api"

export type PropsWithUser<P = {}> = P & {
  user: User
}

export type PropsWithOptionalUser<P = {}> = P & {
  user: User | null
}

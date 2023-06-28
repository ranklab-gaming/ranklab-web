import { User } from "@ranklab/api"

export type PropsWithUser<P = {}> = P & {
  user: User
}

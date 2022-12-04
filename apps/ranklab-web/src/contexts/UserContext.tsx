import { Coach, Player } from "@ranklab/api"
import { ReactNode, createContext } from "react"

interface CoachUser extends Coach {
  type: "coach"
}

interface PlayerUser extends Player {
  type: "player"
}

export type User = CoachUser | PlayerUser

type UserProviderProps = {
  children: ReactNode
  user?: User | null
}

export const UserContext = createContext<User | null | undefined>(null)

export function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

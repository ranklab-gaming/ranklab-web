import { ReactNode, createContext } from "react"
import { User } from "../@types"

type UserProviderProps = {
  children: ReactNode
  user: User | null
}

export const UserContext = createContext<User | null>(null)

export function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

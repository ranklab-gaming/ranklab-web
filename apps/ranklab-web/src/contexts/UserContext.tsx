import { ReactNode, createContext } from "react"
import { User } from "@ranklab/api"

type UserProviderProps = {
  children: ReactNode
  user: User
}

export const UserContext = createContext({} as User)

export function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

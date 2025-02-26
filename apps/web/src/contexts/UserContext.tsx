import { User } from "@ranklab/api"
import { createContext, PropsWithChildren } from "react"

interface UserProviderProps extends PropsWithChildren {
  user: User | null
}

export const UserContext = createContext<User | null | undefined>(null)

export const UserProvider = ({ children, user }: UserProviderProps) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

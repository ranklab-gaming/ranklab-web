import { UserContext } from "@/contexts/UserContext"
import { useContext } from "react"

export function useUser() {
  const user = useContext(UserContext)

  if (!user) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return user
}

export function useOptionalUser() {
  return useContext(UserContext) ?? null
}

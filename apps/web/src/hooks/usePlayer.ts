import { UserContext } from "@/contexts/UserContext"
import { useContext } from "react"

export default function usePlayer() {
  const user = useContext(UserContext)

  if (!user || user.type !== "player") {
    throw new Error(
      "useUser must be used within a UserProvider with a player user"
    )
  }

  return user
}

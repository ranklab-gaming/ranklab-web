import { UserContext } from "@/contexts/UserContext"
import { useContext } from "react"

export default function useCoach() {
  const user = useContext(UserContext)

  if (!user || user.type !== "coach") {
    throw new Error(
      "useUser must be used within a UserProvider with a coach user"
    )
  }

  return user
}

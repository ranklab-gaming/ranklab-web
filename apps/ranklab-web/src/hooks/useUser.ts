import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

export default () => {
  const user = useContext(UserContext)

  if (!user) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return user
}

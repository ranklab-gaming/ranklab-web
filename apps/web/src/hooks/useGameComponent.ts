import { User } from "@/auth"
import { UserContext } from "@/contexts/UserContext"
import gameComponents from "@/games/components"
import type { GameComponents } from "@/games/components"
import { useContext } from "react"

export const useGameComponent = <T extends keyof GameComponents>(
  name: T,
  inUser?: User
): GameComponents[T] => {
  const contextUser = useContext(UserContext)
  const user = inUser || contextUser

  if (!user) {
    throw new Error("user missing in useGameComponent")
  }

  const components =
    gameComponents[user.gameId as keyof typeof gameComponents] ||
    gameComponents.video

  return components[name] || gameComponents.video[name]
}

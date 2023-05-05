import { User } from "@/auth"
import { UserContext } from "@/contexts/UserContext"
import container from "@/games/container"
import type { Container } from "@/games/container"
import { useContext } from "react"

export const useGameDependency = <T extends keyof Container>(
  name: T,
  inUser?: User
): Container[T] => {
  const contextUser = useContext(UserContext)
  const user = inUser || contextUser

  if (!user) {
    throw new Error("user missing in useDependency")
  }

  const components =
    container[user.gameId as keyof typeof container] || container.video

  return components[name] || container.video[name]
}

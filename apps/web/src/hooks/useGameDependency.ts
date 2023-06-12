import { UserContext } from "@/contexts/UserContext"
import container from "@/games/container"
import type { Container } from "@/games/container"
import { useContext } from "react"

export const useGameDependency = <T extends keyof Container>(
  name: T,
  gameIdArg?: string
): Container[T] => {
  const contextUser = useContext(UserContext)
  const gameId = gameIdArg || contextUser?.gameId || "video"

  const components =
    container[gameId as keyof typeof container] || container.video

  return components[name] || container.video[name]
}

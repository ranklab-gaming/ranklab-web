import { UserContext } from "@/contexts/UserContext"
import container from "@/games/container"
import type { Container } from "@/games/container"
import { useContext } from "react"

export const useGameDependency = <T extends keyof Container>(
  name: T,
  gameId?: string
): Container[T] => {
  const contextUser = useContext(UserContext)
  const containerId = gameId || contextUser?.gameId || "video"

  const components =
    container[containerId as keyof typeof container] || container.video

  return (components as Container)[name] || container.video[name]
}

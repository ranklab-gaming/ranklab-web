import gameComponents from "@/games/components"
import type { GameComponents } from "@/games/components"
import { useUser } from "@/hooks/useUser"

export const useGameComponent = <T extends keyof GameComponents>(
  name: T,
  user = useUser()
): GameComponents[T] => {
  const components =
    gameComponents[user.gameId as keyof typeof gameComponents] ||
    gameComponents.video

  return components[name] || gameComponents.video[name]
}

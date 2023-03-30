import overwatch from "@/images/games/overwatch.svg"
import valorant from "@/images/games/valorant.svg"
import hearthstone from "@/images/games/hearthstone.svg"
import { Avatar } from "@mui/material"
import { Game } from "@ranklab/api"
import { forwardRef } from "react"

const logos = {
  overwatch,
  valorant,
  hearthstone,
}

interface Props {
  game: Game
}

export const GameIcon = forwardRef<HTMLDivElement, Props>(function (
  { game, ...props }: Props,
  ref
) {
  return (
    <Avatar
      alt={game.name}
      src={logos[game.id as keyof typeof logos].src}
      ref={ref}
      {...props}
    />
  )
})

GameIcon.displayName = "GameIcon"

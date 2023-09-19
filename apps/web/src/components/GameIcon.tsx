import overwatch from "@/images/games/overwatch.svg"
import { Avatar, SxProps } from "@mui/material"
import { Game } from "@ranklab/api"
import { forwardRef } from "react"

const logos = {
  overwatch,
}

interface Props {
  game: Game
  sx?: SxProps
}

export const GameIcon = forwardRef<HTMLDivElement, Props>(function (
  { game, ...props }: Props,
  ref,
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

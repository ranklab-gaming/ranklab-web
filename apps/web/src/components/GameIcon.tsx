import overwatch from "@/images/games/overwatch.svg"
import valorant from "@/images/games/valorant.svg"
import hearthstone from "@/images/games/hearthstone.svg"
import r6s from "@/images/games/r6s.png"
import test from "@/images/games/test.png"
import chess from "@/images/games/chess.png"
import apex from "@/images/games/apex.svg"
import csgo from "@/images/games/csgo.svg"
import dota2 from "@/images/games/dota2.svg"
import lol from "@/images/games/lol.svg"

import { Avatar, SxProps } from "@mui/material"
import { Game } from "@ranklab/api"
import { forwardRef } from "react"

const logos = {
  overwatch,
  valorant,
  hearthstone,
  r6s,
  test,
  chess,
  apex,
  csgo,
  dota2,
  lol,
}

interface Props {
  game: Game
  sx?: SxProps
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

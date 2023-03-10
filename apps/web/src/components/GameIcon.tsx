import overwatch from "@/images/games/overwatch.svg"
import valorant from "@/images/games/valorant.svg"
import { Avatar } from "@mui/material"
import { Game } from "@ranklab/api"

const logos = {
  overwatch,
  valorant,
}

interface Props {
  game: Game
}

export function GameIcon({ game }: Props) {
  return (
    <Avatar alt={game.name} src={logos[game.id as keyof typeof logos].src} />
  )
}

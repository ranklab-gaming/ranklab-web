import { OverwatchIcon } from "@/games/overwatch/components/OverwatchIcon"
import { Box, BoxProps } from "@mui/material"
import { Game } from "@ranklab/api"
import React from "react"

const icons: Record<string, React.ComponentType> = {
  overwatch: OverwatchIcon,
}

interface Props extends BoxProps {
  game: Game
}

export const GameIcon = ({ game, ...props }: Props) => {
  const Icon = icons[game.id as keyof typeof icons]

  if (!Icon) {
    return null
  }

  return (
    <Box width={48} height={48} {...props}>
      <Icon />
    </Box>
  )
}

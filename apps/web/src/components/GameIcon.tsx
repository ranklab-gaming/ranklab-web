import { OverwatchIcon } from "@/components/OverwatchIcon"
import { Box, BoxProps } from "@mui/material"
import { Game } from "@ranklab/api"
import React from "react"
import { ApexIcon } from "./ApexIcon"
import { Cs2Icon } from "./Cs2Icon"

const icons: Record<string, React.ComponentType> = {
  overwatch: OverwatchIcon,
  apex: ApexIcon,
  cs2: Cs2Icon,
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

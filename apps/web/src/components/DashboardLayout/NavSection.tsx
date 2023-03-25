import {
  Box,
  BoxProps,
  List,
  ListSubheader as MuiListSubheader,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { ComponentProps } from "react"
import { NavListProps, NavListRoot } from "./NavList"

interface NavSectionProps extends BoxProps {
  navConfig: {
    subheader: string
    items: NavListProps[]
  }[]
}

type ListSubheaderProps = ComponentProps<typeof MuiListSubheader>

const ListSubheader = (props: ListSubheaderProps) => (
  <MuiListSubheader disableSticky disableGutters {...props} />
)

export const ListSubheaderStyle = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
}))

export function NavSection({ navConfig, ...other }: NavSectionProps) {
  return (
    <Box {...other}>
      {navConfig.map((group, index) => (
        <List key={index} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle>{group.subheader}</ListSubheaderStyle>
          {group.items.map((list, index) => (
            <NavListRoot key={index} list={list} />
          ))}
        </List>
      ))}
    </Box>
  )
}

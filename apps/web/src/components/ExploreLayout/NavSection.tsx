import { Box, BoxProps, List } from "@mui/material"
import { NavListProps, NavListRoot } from "./NavList"

interface NavSectionProps extends BoxProps {
  navConfig: NavListProps[][]
  collapsed: boolean
}

export const NavSection = ({
  navConfig,
  collapsed,
  ...other
}: NavSectionProps) => {
  return (
    <Box {...other}>
      {navConfig.map((group, index) => (
        <List key={index} disablePadding sx={{ p: 2 }}>
          {group.map((list, index) => (
            <NavListRoot key={index} list={list} collapsed={collapsed} />
          ))}
        </List>
      ))}
    </Box>
  )
}

import { Box, BoxProps, List } from "@mui/material"
import { NavListProps, NavListRoot } from "./NavList"
import React from "react"

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
    <Box display="flex" flexDirection="column" flexGrow={1} {...other}>
      {navConfig.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex === navConfig.length - 1 ? (
            <Box sx={{ flexGrow: 1 }} />
          ) : null}
          <List disablePadding sx={{ p: 2 }}>
            {group.map((list, index) => (
              <NavListRoot key={index} list={list} collapsed={collapsed} />
            ))}
          </List>
        </React.Fragment>
      ))}
    </Box>
  )
}

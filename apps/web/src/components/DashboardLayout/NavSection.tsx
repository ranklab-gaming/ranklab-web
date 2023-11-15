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
        <List
          disablePadding
          key={groupIndex}
          sx={{
            p: 2,
            ...(groupIndex === navConfig.length - 1 ? { mt: "auto" } : {}),
          }}
        >
          {group.map((list, index) => (
            <NavListRoot key={index} list={list} collapsed={collapsed} />
          ))}
        </List>
      ))}
    </Box>
  )
}

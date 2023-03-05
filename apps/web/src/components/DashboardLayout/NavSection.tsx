import { styled } from "@mui/material/styles"
import {
  List,
  Box,
  ListSubheader as MuiListSubheader,
  BoxProps,
} from "@mui/material"
import {
  DashboardLayoutNavListProps,
  DashboardLayoutNavListRoot,
} from "./NavList"
import { ComponentProps, FunctionComponent } from "react"

interface NavSectionProps extends BoxProps {
  navConfig: {
    subheader: string
    items: DashboardLayoutNavListProps[]
  }[]
}

type ListSubheaderProps = ComponentProps<typeof MuiListSubheader>

const ListSubheader: FunctionComponent<ListSubheaderProps> = (props) => (
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

export function DashboardLayoutNavSection({
  navConfig,
  ...other
}: NavSectionProps) {
  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle>{group.subheader}</ListSubheaderStyle>
          {group.items.map((list) => (
            <DashboardLayoutNavListRoot
              key={list.title + list.path}
              list={list}
            />
          ))}
        </List>
      ))}
    </Box>
  )
}

import { iconStyles, navbarStyles } from "@/styles"
import {
  LinkProps,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemIconProps,
  ListItemText,
} from "@mui/material"
import { alpha, styled } from "@mui/material/styles"
import { ReactNode } from "react"

type BaseProps = Omit<LinkProps & ListItemButtonProps, "component">

export interface ListItemStyleProps extends BaseProps {
  component?: ReactNode
  activeRoot?: boolean
  roles?: string[]
  collapsed: boolean
}

export const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) =>
    prop !== "activeRoot" && prop !== "open" && prop !== "collapsed",
})<ListItemStyleProps>(({ activeRoot, theme, collapsed }) => ({
  ...theme.typography.body2,
  position: "relative",
  height: navbarStyles.dashboardItemRootHeight,
  textTransform: "capitalize",
  ...(collapsed
    ? {
        paddingLeft: 0,
        paddingRight: 0,
        justifyContent: "center",
        alignItems: "center",
      }
    : {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1.5),
        marginBottom: theme.spacing(0.5),
      }),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.main,
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    ),
  }),
}))

export const ListItemTextStyle = styled(ListItemText)(({ theme }) => ({
  whiteSpace: "nowrap",
  transition: theme.transitions.create(["width", "opacity"], {
    duration: theme.transitions.duration.shorter,
  }),
}))

interface ListItemIconStyleProps extends ListItemIconProps {
  collapsed: boolean
}

export const ListItemIconStyle = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<ListItemIconStyleProps>(({ collapsed }) => ({
  width: iconStyles.navbarItem,
  height: iconStyles.navbarItem,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": { width: "100%", height: "100%" },
  ...(collapsed && {
    marginRight: 0,
  }),
}))

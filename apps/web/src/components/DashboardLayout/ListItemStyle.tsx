import { iconStyles, navbarStyles } from "@/styles"
import {
  LinkProps,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { alpha, styled } from "@mui/material/styles"
import { ReactNode } from "react"

type BaseProps = LinkProps & ListItemButtonProps

export interface ListItemStyleProps extends BaseProps {
  component?: ReactNode
  activeRoot?: boolean
  activeSub?: boolean
  subItem?: boolean
  roles?: string[]
}

export const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) =>
    prop !== "activeRoot" &&
    prop !== "activeSub" &&
    prop !== "subItem" &&
    prop !== "open",
})<ListItemStyleProps>(({ activeRoot, activeSub, subItem, theme }) => ({
  ...theme.typography.body2,
  position: "relative",
  height: navbarStyles.dashboardItemRootHeight,
  textTransform: "capitalize",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.main,
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  }),
  ...(activeSub && {
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,
  }),
  ...(subItem && {
    height: navbarStyles.dashboardItemSubHeight,
  }),
}))

export const ListItemTextStyle = styled(ListItemText)(({ theme }) => ({
  whiteSpace: "nowrap",
  transition: theme.transitions.create(["width", "opacity"], {
    duration: theme.transitions.duration.shorter,
  }),
}))

export const ListItemIconStyle = styled(ListItemIcon)({
  width: iconStyles.navbarItem,
  height: iconStyles.navbarItem,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": { width: "100%", height: "100%" },
})

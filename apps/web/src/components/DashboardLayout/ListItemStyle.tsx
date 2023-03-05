import { ReactNode } from "react"
import { alpha, styled } from "@mui/material/styles"
import {
  LinkProps,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  ListItemButtonProps,
} from "@mui/material"
import { iconStyles, navbarStyles } from "@/styles"

type IProps = LinkProps & ListItemButtonProps

export interface DashboardLayoutListItemStyleProps extends IProps {
  component?: ReactNode
  activeRoot?: boolean
  activeSub?: boolean
  subItem?: boolean
  roles?: string[]
}

export const DashboardLayoutListItemStyle = styled(
  ListItemButton
)<DashboardLayoutListItemStyleProps>(
  ({ activeRoot, activeSub, subItem, theme }) => ({
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
  })
)

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

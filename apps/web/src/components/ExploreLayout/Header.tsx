import { IconButtonAnimate } from "@/components/IconButtonAnimate"
import { Iconify } from "@/components/Iconify"
import { useOffsetTop } from "@/hooks/useOffsetTop"
import { useResponsive } from "@/hooks/useResponsive"
import { headerStyles, navbarStyles, styles } from "@/styles"
import { AppBar, Toolbar } from "@mui/material"
import { styled } from "@mui/material/styles"

type RootStyleProps = {
  isOffset: boolean
  collapsed: boolean
}

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isOffset" && prop !== "collapsed",
})<RootStyleProps>(({ isOffset, theme, collapsed }) => ({
  ...styles(theme).backgroundBlur(),
  boxShadow: "none",
  height: headerStyles.mobileHeight,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("lg")]: {
    height: headerStyles.dashboardDesktopHeight,
    width: `calc(100% - ${
      (collapsed
        ? navbarStyles.dashboardCollapsedWidth
        : navbarStyles.dashboardWidth) + 1
    }px)`,
    ...(isOffset && {
      height: headerStyles.dashboardDesktopOffsetHeight,
    }),
  },
}))

type Props = {
  onOpenSidebar: VoidFunction
  collapsed: boolean
}

export const Header = ({ onOpenSidebar, collapsed }: Props) => {
  const isOffset = useOffsetTop(headerStyles.dashboardDesktopHeight)
  const isDesktop = useResponsive("up", "lg")

  return (
    <RootStyle isOffset={isOffset} collapsed={collapsed}>
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 },
        }}
      >
        {!isDesktop && (
          <IconButtonAnimate
            onClick={onOpenSidebar}
            sx={{ mr: 1, color: "text.primary" }}
          >
            <Iconify icon="eva:menu-2-outline" />
          </IconButtonAnimate>
        )}
      </Toolbar>
    </RootStyle>
  )
}

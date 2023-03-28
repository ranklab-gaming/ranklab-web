import { IconButtonAnimate } from "@/components/IconButtonAnimate"
import { Iconify } from "@/components/Iconify"
import { useOffsetTop } from "@/hooks/useOffsetTop"
import { useResponsive } from "@/hooks/useResponsive"
import { headerStyles, navbarStyles, styles } from "@/styles"
import { AppBar, Box, Stack, Toolbar } from "@mui/material"
import { styled } from "@mui/material/styles"
import { AccountPopover } from "./AccountPopover"

type RootStyleProps = {
  isOffset: boolean
}

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isOffset",
})<RootStyleProps>(({ isOffset, theme }) => ({
  ...styles(theme).backgroundBlur(),
  boxShadow: "none",
  height: headerStyles.mobileHeight,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("lg")]: {
    height: headerStyles.dashboardDesktopHeight,
    width: `calc(100% - ${navbarStyles.dashboardWidth + 1}px)`,
    ...(isOffset && {
      height: headerStyles.dashboardDesktopOffsetHeight,
    }),
  },
}))

type Props = {
  onOpenSidebar: VoidFunction
}

export const Header = ({ onOpenSidebar }: Props) => {
  const isOffset = useOffsetTop(headerStyles.dashboardDesktopHeight)
  const isDesktop = useResponsive("up", "lg")

  return (
    <RootStyle isOffset={isOffset}>
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
            <Iconify icon="eva:menu-2-fill" />
          </IconButtonAnimate>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  )
}

import { useEffect } from "react"
// next
import NextLink from "next/link"
import { useRouter } from "next/router"
// material
import { alpha, styled } from "@mui/material/styles"
import { Box, Stack, Drawer, Tooltip, CardActionArea } from "@mui/material"
// hooks
import useCollapseDrawer from "../../hooks/useCollapseDrawer"
// components
import Logo from "../../components/Logo"
import Scrollbar from "../../components/Scrollbar"
//
import { MHidden } from "../../components/@material-extend"
import { useUser } from "@auth0/nextjs-auth0"
import NavSection from "src/components/NavSection"
import SvgIconStyle from "src/components/SvgIconStyle"
import Label from "src/components/Label"

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  blog: getIcon("ic_blog"),
  cart: getIcon("ic_cart"),
  chat: getIcon("ic_chat"),
  mail: getIcon("ic_mail"),
  user: getIcon("ic_user"),
  kanban: getIcon("ic_kanban"),
  banking: getIcon("ic_banking"),
  booking: getIcon("ic_booking"),
  invoice: getIcon("ic_invoice"),
  calendar: getIcon("ic_calendar"),
  ecommerce: getIcon("ic_ecommerce"),
  analytics: getIcon("ic_analytics"),
  dashboard: getIcon("ic_dashboard"),
}

const PATH_DASHBOARD = {} as any

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "general",
    items: [
      {
        title: "app",
        path: "/path" || PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard,
      },
      {
        title: "e-commerce",
        path: "/path" || PATH_DASHBOARD.general.ecommerce,
        icon: ICONS.ecommerce,
      },
      {
        title: "analytics",
        path: "/path" || PATH_DASHBOARD.general.analytics,
        icon: ICONS.analytics,
      },
      {
        title: "banking",
        path: "/path" || PATH_DASHBOARD.general.banking,
        icon: ICONS.banking,
      },
      {
        title: "booking",
        path: "/path" || PATH_DASHBOARD.general.booking,
        icon: ICONS.booking,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: "management",
    items: [
      // USER
      {
        title: "user",
        path: "/path" || PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: "profile", path: "/path" || PATH_DASHBOARD.user.profile },
          { title: "cards", path: "/path" || PATH_DASHBOARD.user.cards },
          { title: "list", path: "/path" || PATH_DASHBOARD.user.list },
          { title: "create", path: "/path" || PATH_DASHBOARD.user.new },
          { title: "edit", path: "/path" || PATH_DASHBOARD.user.demoEdit },
          { title: "account", path: "/path" || PATH_DASHBOARD.user.account },
        ],
      },

      // E-COMMERCE
      {
        title: "e-commerce",
        path: "/path" || PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: "shop", path: "/path" || PATH_DASHBOARD.eCommerce.shop },
          {
            title: "product",
            path: "/path" || PATH_DASHBOARD.eCommerce.demoView,
          },
          { title: "list", path: "/path" || PATH_DASHBOARD.eCommerce.list },
          { title: "create", path: "/path" || PATH_DASHBOARD.eCommerce.new },
          { title: "edit", path: "/path" || PATH_DASHBOARD.eCommerce.demoEdit },
          {
            title: "checkout",
            path: "/path" || PATH_DASHBOARD.eCommerce.checkout,
          },
        ],
      },

      // INVOICE
      {
        title: "invoice",
        path: "/path" || PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: "list", path: "/path" || PATH_DASHBOARD.invoice.list },
          {
            title: "details",
            path: "/path" || PATH_DASHBOARD.invoice.demoView,
          },
          { title: "create", path: "/path" || PATH_DASHBOARD.invoice.new },
          { title: "edit", path: "/path" || PATH_DASHBOARD.invoice.demoEdit },
        ],
      },

      // BLOG
      {
        title: "blog",
        path: "/path" || PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: "posts", path: "/path" || PATH_DASHBOARD.blog.posts },
          { title: "post", path: "/path" || PATH_DASHBOARD.blog.demoView },
          { title: "create", path: "/path" || PATH_DASHBOARD.blog.new },
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: "app",
    items: [
      {
        title: "mail",
        path: "/path" || PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        info: (
          <Label variant="outlined" color="error">
            +32
          </Label>
        ),
      },
      {
        title: "chat",
        path: "/path" || PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
      },
      {
        title: "calendar",
        path: "/path" || PATH_DASHBOARD.calendar,
        icon: ICONS.calendar,
      },
      {
        title: "kanban",
        path: "/path" || PATH_DASHBOARD.kanban,
        icon: ICONS.kanban,
      },
    ],
  },
]

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280
const COLLAPSE_WIDTH = 102

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.complex,
    }),
  },
}))

// ----------------------------------------------------------------------

type IconCollapseProps = {
  onToggleCollapse: VoidFunction
  collapseClick: boolean
}

function IconCollapse({ onToggleCollapse, collapseClick }: IconCollapseProps) {
  return (
    <Tooltip title="Mini Menu">
      <CardActionArea
        onClick={onToggleCollapse}
        sx={{
          width: 18,
          height: 18,
          display: "flex",
          cursor: "pointer",
          borderRadius: "50%",
          alignItems: "center",
          color: "text.primary",
          justifyContent: "center",
          border: "solid 1px currentColor",
          ...(collapseClick && {
            borderWidth: 2,
          }),
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "currentColor",
            transition: (theme) => theme.transitions.create("all"),
            ...(collapseClick && {
              width: 0,
              height: 0,
            }),
          }}
        />
      </CardActionArea>
    </Tooltip>
  )
}

type DashboardSidebarProps = {
  isOpenSidebar: boolean
  onCloseSidebar: VoidFunction
}

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
}: DashboardSidebarProps) {
  const { pathname } = useRouter()

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onToggleCollapse,
    onHoverEnter,
    onHoverLeave,
  } = useCollapseDrawer()

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const { user } = useUser()

  if (!user) return null

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: "center",
          }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <NextLink href="/">
            <Box sx={{ display: "inline-flex" }}>
              <Logo />
            </Box>
          </NextLink>

          <MHidden width="lgDown">
            {!isCollapse && (
              <IconCollapse
                onToggleCollapse={onToggleCollapse}
                collapseClick={collapseClick}
              />
            )}
          </MHidden>
        </Stack>

        <NavSection navConfig={navConfig} />
      </Stack>
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH,
        },
        ...(collapseClick && {
          position: "absolute",
        }),
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) =>
                  alpha(theme.palette.background.default, 0.88),
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  )
}

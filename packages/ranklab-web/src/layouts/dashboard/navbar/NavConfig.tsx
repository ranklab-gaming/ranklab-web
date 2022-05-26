// components
import Iconify from "src/components/Iconify"

const ICONS = {
  user: <Iconify icon={"mdi:account"} />,
  dashboard: <Iconify icon={"mdi:view-dashboard"} />,
  recordings: <Iconify icon={"mdi:video"} />,
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "general",
    items: [
      { title: "dashboard", path: "/dashboard", icon: ICONS.dashboard },
      { title: "recordings", path: "/recordings", icon: ICONS.recordings },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: "account",
    items: [
      // USER
      {
        title: "profile",
        path: "/profile",
        icon: ICONS.user,
      },
    ],
  },
]

export default navConfig

// components
import Iconify from "src/components/Iconify"

const ICONS = {
  user: <Iconify icon={"mdi:account"} />,
  dashboard: <Iconify icon={"mdi:view-dashboard"} />,
  recordings: <Iconify icon={"mdi:video"} />,
  upload: <Iconify icon={"mdi:plus"} />,
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "",
    items: [
      { title: "Upload VOD", path: "/r/new", icon: ICONS.upload },
      { title: "Dashboard", path: "/dashboard", icon: ICONS.dashboard },
      { title: "Recordings", path: "/recordings", icon: ICONS.recordings },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: "Settings",
    items: [
      // USER
      {
        title: "Account",
        path: "/profile",
        icon: ICONS.user,
      },
    ],
  },
]

export default navConfig

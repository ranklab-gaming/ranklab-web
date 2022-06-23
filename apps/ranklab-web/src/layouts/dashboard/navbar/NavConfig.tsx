// components
import Iconify from "src/components/Iconify"

const ICONS = {
  user: <Iconify icon={"mdi:account"} />,
  dashboard: <Iconify icon={"mdi:view-dashboard"} />,
  recordings: <Iconify icon={"mdi:video"} />,
  upload: <Iconify icon={"mdi:plus"} />,
  archive: <Iconify icon={"mdi:archive"} />,
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "",
    items: [
      { title: "Upload VOD", path: "/r/new", icon: ICONS.upload },
      { title: "Dashboard", path: "/dashboard", icon: ICONS.dashboard },
      { title: "Archive", path: "/archive", icon: ICONS.archive },
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
        path: "/account",
        icon: ICONS.user,
      },
    ],
  },
]

export default navConfig

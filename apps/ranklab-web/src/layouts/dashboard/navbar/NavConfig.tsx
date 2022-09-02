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
      {
        title: "Upload VOD",
        path: "/player/recordings/new",
        icon: ICONS.upload,
      },
      { title: "Dashboard", path: "/player/dashboard", icon: ICONS.dashboard },
      { title: "Archive", path: "/player/archive", icon: ICONS.archive },
      {
        title: "Recordings",
        path: "/player/recordings",
        icon: ICONS.recordings,
      },
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
        path: "/player/account",
        icon: ICONS.user,
      },
    ],
  },
]

export default navConfig

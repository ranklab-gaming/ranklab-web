// components
import Label from "../../../components/Label"
import Iconify from "../../../components/Iconify"
import SvgIconStyle from "../../../components/SvgIconStyle"

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
)

const ICONS = {
  user: getIcon("ic_user"),
  dashboard: getIcon("ic_dashboard"),
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "general",
    items: [{ title: "app", path: "/dashboard", icon: ICONS.dashboard }],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: "management",
    items: [
      // USER
      {
        title: "user",
        path: "/profile",
        icon: ICONS.user,
      },
    ],
  },
]

export default navConfig

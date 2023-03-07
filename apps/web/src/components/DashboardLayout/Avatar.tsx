import { useTheme } from "@mui/material/styles"
import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from "@mui/material"
import { useUser } from "@/hooks/useUser"

type AvatarColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"

const primaryName = ["A", "N", "H", "L", "Q", "9", "8"]
const infoName = ["F", "G", "T", "I", "J", "1", "2", "3"]
const successName = ["K", "D", "Y", "B", "O", "4", "5"]
const warningName = ["P", "E", "R", "S", "C", "U", "6", "7"]
const errorName = ["V", "W", "X", "M", "Z"]

function initial(name: string) {
  return name && name.charAt(0).toUpperCase()
}

function getAvatarColor(name: string) {
  if (primaryName.includes(initial(name))) return "primary"
  if (infoName.includes(initial(name))) return "info"
  if (successName.includes(initial(name))) return "success"
  if (warningName.includes(initial(name))) return "warning"
  if (errorName.includes(initial(name))) return "error"
  return "default"
}

interface AvatarProps extends MuiAvatarProps {
  color?: AvatarColor
}

function Avatar({ color = "default", children, sx, ...other }: AvatarProps) {
  const theme = useTheme()

  if (color === "default") {
    return (
      <MuiAvatar sx={sx} {...other}>
        {children}
      </MuiAvatar>
    )
  }

  return (
    <MuiAvatar
      sx={{
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette[color].contrastText,
        backgroundColor: theme.palette[color].main,
        ...sx,
      }}
      {...other}
    >
      {children}
    </MuiAvatar>
  )
}

export function DashboardLayoutAvatar({ ...other }: AvatarProps) {
  const { name } = useUser()

  return (
    <Avatar alt={name} color={getAvatarColor(name)} {...other}>
      {initial(name)}
    </Avatar>
  )
}

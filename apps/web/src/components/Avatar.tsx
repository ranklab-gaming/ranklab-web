import { uploadsCdnUrl } from "@/config"
import { UserContext } from "@/contexts/UserContext"
import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { User } from "@ranklab/api"
import { forwardRef, useContext } from "react"

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

function getInitial(name: string) {
  return name && name.charAt(0).toUpperCase()
}

function getAvatarColor(name: string) {
  if (primaryName.includes(getInitial(name))) return "primary"
  if (infoName.includes(getInitial(name))) return "info"
  if (successName.includes(getInitial(name))) return "success"
  if (warningName.includes(getInitial(name))) return "warning"
  if (errorName.includes(getInitial(name))) return "error"
  return "default"
}

interface AvatarProps extends MuiAvatarProps {
  color?: AvatarColor
  user?: User
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { user: initialUser, sx, ...other }: AvatarProps,
  ref,
) {
  const theme = useTheme()
  const contextUser = useContext(UserContext)
  const user = initialUser ?? contextUser

  if (!user) {
    throw new Error("user is missing")
  }

  const { name, avatarImageKey } = user
  const initial = getInitial(name)
  const color = getAvatarColor(name)

  return (
    <MuiAvatar
      sx={{
        ...(color !== "default"
          ? {
              fontWeight: theme.typography.fontWeightMedium,
              color: theme.palette[color].contrastText,
              backgroundColor: theme.palette[color].main,
            }
          : null),
        ...sx,
      }}
      alt={name}
      ref={ref}
      {...(avatarImageKey
        ? { src: `${uploadsCdnUrl}/${avatarImageKey}` }
        : { color: getAvatarColor(name), children: initial })}
      {...other}
    />
  )
})

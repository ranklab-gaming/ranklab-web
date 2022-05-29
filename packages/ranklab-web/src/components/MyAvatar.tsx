import useUser from "../hooks/useUser"
import createAvatar from "../utils/createAvatar"
import Avatar, { Props as AvatarProps } from "./Avatar"
import { useUser as useAuth0User } from "@auth0/nextjs-auth0"

export default function MyAvatar({ ...other }: AvatarProps) {
  const user = useUser()
  const { user: profile } = useAuth0User()

  return (
    <Avatar
      src={profile?.picture || undefined}
      alt={user.name!}
      color={profile?.picture ? "default" : createAvatar(user.name).color}
      {...other}
    >
      {createAvatar(user.name).name}
    </Avatar>
  )
}

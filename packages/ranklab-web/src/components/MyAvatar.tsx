// hooks
import { useUser } from "@auth0/nextjs-auth0"
// utils
import createAvatar from "../utils/createAvatar"
//
import Avatar, { Props as AvatarProps } from "./Avatar"

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps) {
  const { user } = useUser()

  return (
    <Avatar
      src={user?.picture || undefined}
      alt={user?.name!}
      color={user?.picture ? "default" : createAvatar(user?.name!).color}
      {...other}
    >
      {createAvatar(user?.name!).name}
    </Avatar>
  )
}

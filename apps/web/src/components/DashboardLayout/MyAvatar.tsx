import useSession from "../hooks/useSession"
import createAvatar from "../utils/createAvatar"
import Avatar, { Props as AvatarProps } from "./Avatar"

export default function MyAvatar({ ...other }: AvatarProps) {
  const session = useSession()

  return (
    <Avatar
      alt={session.user.name}
      color={createAvatar(session.user.name).color}
      {...other}
    >
      {createAvatar(session.user.name).name}
    </Avatar>
  )
}

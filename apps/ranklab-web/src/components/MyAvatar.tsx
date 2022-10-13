import useUser from "../hooks/useUser"
import createAvatar from "../utils/createAvatar"
import Avatar, { Props as AvatarProps } from "./Avatar"
import { useSession } from "next-auth/react"

export default function MyAvatar({ ...other }: AvatarProps) {
  const user = useUser()
  const { data: session } = useSession()

  if (!session) {
    throw new Error("Session is required")
  }

  const { user: profile } = session

  return (
    <Avatar
      src={profile?.image || undefined}
      alt={user.name!}
      color={profile?.image ? "default" : createAvatar(user.name).color}
      {...other}
    >
      {createAvatar(user.name).name}
    </Avatar>
  )
}

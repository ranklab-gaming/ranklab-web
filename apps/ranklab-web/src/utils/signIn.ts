import { UserType } from "@ranklab/api"
import { signIn as nextAuthSignIn } from "next-auth/react"

export default function signIn(userType: UserType) {
  nextAuthSignIn(
    "ranklab",
    { callbackUrl: `/${userType}/dashboard` },
    { user_type: userType }
  )
}

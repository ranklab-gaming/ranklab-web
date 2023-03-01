import { UserType } from "@ranklab/api"
import { signIn } from "next-auth/react"

type Intent = "login" | "signup"

export async function authenticate(
  userType: UserType,
  intent: Intent = "login",
  params: Record<string, string | null> = {}
) {
  return signIn(
    "ranklab",
    { callbackUrl: `/${userType}/dashboard` },
    { user_type: userType, intent, ...params }
  )
}

import { UserType } from "@ranklab/api"
import { signIn, signOut } from "next-auth/react"

export async function authenticate(
  userType: UserType,
  intent: "login" | "signup" = "login",
  params: Record<string, string | null> = {}
) {
  return signIn(
    "ranklab",
    { callbackUrl: `/${userType}/dashboard` },
    { user_type: userType, intent, ...params }
  )
}

export async function logout() {
  await signOut({ redirect: false })

  window.location.href =
    "/api/oidc/session/end?client_id=web" +
    `&post_logout_redirect_uri=${encodeURIComponent(
      `${window.location.origin}/api/logout`
    )}`
}

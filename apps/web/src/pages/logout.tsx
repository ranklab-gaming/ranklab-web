import { withSessionSsr } from "@/server/session"
import { getParam } from "@/server/utils"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export const getServerSideProps = withSessionSsr(async (ctx) => {
  const returnUrl = getParam(ctx, "return_url") ?? undefined

  ctx.req.session.returnUrl = returnUrl
  await ctx.req.session.save()

  return {
    props: {},
  }
})

export default function () {
  const router = useRouter()
  const [shouldLogout, setShouldLogout] = useState(false)

  const logout = async () => {
    await signOut({ redirect: false })

    router.push(
      "/api/oidc/session/end?client_id=web" +
        `&post_logout_redirect_uri=${encodeURIComponent(
          `${window.location.origin}/api/logout`
        )}`
    )
  }

  useEffect(() => {
    setShouldLogout(true)
  })

  useEffect(() => {
    if (shouldLogout) {
      logout()
    }
  }, [shouldLogout])
}

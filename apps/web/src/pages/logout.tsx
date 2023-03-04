import { getParam } from "@/request"
import { GetServerSideProps } from "next"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

interface Props {
  returnUrl: string | null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const returnUrl = getParam(ctx, "return_url")

  return {
    props: {
      returnUrl,
    },
  }
}

export default function ({ returnUrl }: Props) {
  const router = useRouter()
  const [shouldLogout, setShouldLogout] = useState(false)

  const logout = async () => {
    await signOut({ redirect: false })

    router.push(
      "/api/oidc/session/end?client_id=web" +
        `&post_logout_redirect_uri=${encodeURIComponent(
          returnUrl ?? window.location.origin
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

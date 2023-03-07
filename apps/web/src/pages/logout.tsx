import { withSessionSsr } from "@/session"
import { logout } from "@/auth/client"
import { useState, useEffect } from "react"

export const getServerSideProps = withSessionSsr(
  async ({ req: { session }, query: { return_url } }) => {
    session.postLogoutReturnUrl =
      typeof return_url === "string" ? return_url : "/"

    await session.save()

    return {
      props: {},
    }
  }
)

export default function () {
  const [shouldLogout, setShouldLogout] = useState(false)

  useEffect(() => {
    setShouldLogout(true)
  })

  useEffect(() => {
    if (shouldLogout) {
      logout()
    }
  }, [shouldLogout])
}

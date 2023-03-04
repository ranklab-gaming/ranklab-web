import { GetServerSideProps } from "next"
import { getParam } from "@/request"
import { useEffect, useState } from "react"
import { authenticate } from "@/auth"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"

interface Props {
  token: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const token = getParam(ctx, "token")

  if (!token) {
    throw new Error("invitation token is missing")
  }

  return {
    props: {
      token,
    },
  }
}

export default function ({ token }: Props) {
  const router = useRouter()
  const [shouldAuthenticate, setShouldAuthenticate] = useState(false)

  const authenticateOrLogout = async () => {
    const session = await getSession()

    if (session) {
      router.push(
        `/logout?return_url=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      )

      return
    }

    setShouldAuthenticate(true)
  }

  useEffect(() => {
    authenticateOrLogout()
  })

  useEffect(() => {
    if (shouldAuthenticate) {
      authenticate("coach", "signup", { invitation_token: token })
    }
  }, [shouldAuthenticate])
}

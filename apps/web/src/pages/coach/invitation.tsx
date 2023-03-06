import { getParam } from "@/server/utils"
import { useEffect, useState } from "react"
import { authenticate } from "@/auth"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { GetServerSideProps } from "next"

interface Props {
  token: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const token = getParam(ctx, "token")
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: `/logout?user_type=coach&return_url=${encodeURIComponent(
          ctx.req.url ?? "/"
        )}`,
        permanent: false,
      },
    }
  }

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
  const [shouldAuthenticate, setShouldAuthenticate] = useState(false)

  useEffect(() => {
    setShouldAuthenticate(true)
  })

  useEffect(() => {
    if (shouldAuthenticate) {
      authenticate("coach", "signup", { invitation_token: token })
    }
  }, [shouldAuthenticate])
}

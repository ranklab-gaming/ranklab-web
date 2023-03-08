import { authenticate } from "@/auth/client"
import { useParam } from "@/hooks/useParam"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

  return {
    props: {},
  }
}

export default function () {
  const [shouldAuthenticate, setShouldAuthenticate] = useState(false)
  const token = useParam("token")

  if (!token) {
    throw new Error("token param is missing")
  }

  useEffect(() => {
    setShouldAuthenticate(true)
  })

  useEffect(() => {
    if (shouldAuthenticate) {
      authenticate("coach", "signup", { token })
    }
  }, [shouldAuthenticate])
}

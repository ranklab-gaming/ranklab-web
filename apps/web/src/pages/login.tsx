import { authenticate } from "@/auth"
import { getParam } from "@/server/utils"
import { UserType } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useState, useEffect } from "react"
import { authOptions } from "./api/auth/[...nextauth]"
import { webHost } from "@/config/server"

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let userType = getParam(ctx, "user_type")
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
  }

  if (session) {
    return {
      redirect: {
        destination: `/logout?user_type=${userType}&return_url=${encodeURIComponent(
          `${webHost}${ctx.resolvedUrl}`
        )}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      userType,
    },
  }
}

export default function ({ userType }: Props) {
  const [shouldLogin, setShouldLogin] = useState(false)

  useEffect(() => {
    setShouldLogin(true)
  })

  useEffect(() => {
    if (shouldLogin) {
      authenticate(userType)
    }
  }, [shouldLogin])
}

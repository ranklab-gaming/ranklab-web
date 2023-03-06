import { authenticate } from "@/auth"
import { getParam, getSessionUserType } from "@/server/utils"
import { UserType } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useState, useEffect } from "react"
import { authOptions } from "./api/auth/[...nextauth]"

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  let userType = getParam(ctx, "user_type")
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
  }

  if (session && getSessionUserType(session) !== userType) {
    return {
      redirect: {
        destination: `/logout?user_type=${userType}&return_url=${encodeURIComponent(
          ctx.req.url ?? "/"
        )}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      userType: userType as UserType,
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

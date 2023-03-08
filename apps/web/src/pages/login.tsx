import { authenticate } from "@/auth/client"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { UserType } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  let userType = ctx.query.user_type as UserType
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!["coach", "player"].includes(userType)) {
    userType = "player"
  }

  if (session && session.userType !== userType) {
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

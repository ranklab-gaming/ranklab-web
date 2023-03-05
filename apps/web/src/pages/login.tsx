import { authenticate } from "@/auth"
import { getParam } from "@/server/utils"
import { UserType } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { useState, useEffect } from "react"

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let userType = getParam(ctx, "user_type")

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
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

import { UserType } from "@ranklab/api"
import { getParam } from "@/pages"
import { GetServerSideProps } from "next"
import PasswordResetPage from "@/components/PasswordResetPage"

interface Props {
  userType: UserType
  token: string
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  let userType = getParam(ctx, "user_type")
  const token = getParam(ctx, "token")

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
  }

  if (!token) {
    throw new Error("token is missing")
  }

  return {
    props: {
      userType: userType as UserType,
      token,
    },
  }
}

export default function ({ userType, token }: Props) {
  return <PasswordResetPage userType={userType} token={token} />
}

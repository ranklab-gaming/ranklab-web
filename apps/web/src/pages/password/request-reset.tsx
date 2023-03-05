import { UserType } from "@ranklab/api"
import { getParam } from "@/server/utils"
import { GetServerSideProps } from "next"
import PasswordRequestResetPage from "@/components/PasswordRequestResetPage"

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  let userType = getParam(ctx, "user_type")

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
  }

  return {
    props: {
      userType: userType as UserType,
    },
  }
}

export default function ({ userType }: Props) {
  return <PasswordRequestResetPage userType={userType} />
}

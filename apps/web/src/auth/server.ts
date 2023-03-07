import { createServerApi } from "@/api/server"
import { userFromCoach, userFromPlayer, User } from "../auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { UserType } from "@ranklab/api"
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
} from "next"
import { getServerSession } from "next-auth"

export type PropsWithUser<P = {}> = P & {
  user: User
}

type GetServerSidePropsWithUser<P extends { [key: string]: any }> = (
  ctx: PropsWithUser<GetServerSidePropsContext>
) => Promise<GetServerSidePropsResult<P>>

export function withUserSsr<P extends { [key: string]: any }>(
  userType: UserType,
  getServerSideProps: GetServerSidePropsWithUser<P>
): GetServerSideProps<PropsWithUser<P>> {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<PropsWithUser<P>>> => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const api = await createServerApi(ctx)

    if (
      !session ||
      userType !== session.userType ||
      (session.payload?.exp ?? 0) * 1000 < Date.now()
    ) {
      return {
        redirect: {
          destination: "/login?user_type=" + userType,
          permanent: false,
        },
      }
    }

    const user =
      userType === "coach"
        ? userFromCoach(await api.coachAccountGet())
        : userFromPlayer(await api.playerAccountGet())

    const res = await getServerSideProps({ ...ctx, user })

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const props = await res.props

    return {
      props: { ...props, user },
    }
  }
}

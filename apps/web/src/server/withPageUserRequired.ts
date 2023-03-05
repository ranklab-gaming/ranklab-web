import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { UserType } from "@ranklab/api"
import { createServerApi } from "@/api/server"
import { decodeJwt } from "jose"
import { User, userFromCoach, userFromPlayer } from "@/auth"

export type PropsWithUser<P> = P & {
  user: User
}

type GetServerSidePropsWithUser<P extends { [key: string]: any }> = (
  ctx: PropsWithUser<GetServerSidePropsContext>
) => Promise<GetServerSidePropsResult<P>>

export function withPageUserRequired<P extends { [key: string]: any }>(
  userType: UserType,
  getServerSideProps: GetServerSidePropsWithUser<P>
): GetServerSideProps<PropsWithUser<P>> {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<PropsWithUser<P>>> => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const api = await createServerApi(ctx)

    if (!session) {
      return {
        redirect: {
          destination: "/login?user_type=" + userType,
          permanent: false,
        },
      }
    }

    const jwt = decodeJwt(session.accessToken)

    if (!jwt.sub) {
      throw new Error("sub is missing from jwt")
    }

    const sessionUserType = jwt.sub.split(":")[0]

    if (userType !== sessionUserType) {
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

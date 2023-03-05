import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { Coach, Player, UserType } from "@ranklab/api"
import { createServerApi } from "@/api/server"
import { decodeJwt } from "jose"
import { User } from "@/api"

export type PropsWithUser<P, U extends UserType> = P & {
  user: User<U>
}

type GetServerSidePropsWithUserResult<
  P,
  U extends UserType
> = GetServerSidePropsResult<PropsWithUser<P, U>>

type GetServerSidePropsWithUser<P, U extends UserType> = (
  ctx: GetServerSidePropsContext & { user: User<U> }
) => Promise<GetServerSidePropsResult<P>>

export function withPageUserRequired<
  P extends { [key: string]: any } = { [key: string]: any },
  U extends UserType = UserType
>(userType: U, getServerSideProps: GetServerSidePropsWithUser<P, U>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsWithUserResult<P, U>> => {
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

    let user: User<U>

    if (userType === "coach") {
      user = (await api.coachAccountGet()) as User<U>
    } else {
      user = (await api.playerAccountGet()) as User<U>
    }

    const res = await getServerSideProps({ ...ctx, user })

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const props = await res.props

    return { props: { ...props, user } } as GetServerSidePropsWithUserResult<
      P,
      U
    >
  }
}

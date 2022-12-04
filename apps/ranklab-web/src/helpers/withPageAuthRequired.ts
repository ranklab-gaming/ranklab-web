import { ParsedUrlQuery } from "querystring"
import { GetServerSideProps } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { UserType } from "@ranklab/api"
import { decodeJwt } from "jose"
import api from "../api/server"

export type PropsWithSession<P> = P & {
  session?: Session
}

interface Options<P extends { [key: string]: any }, Q extends ParsedUrlQuery> {
  getServerSideProps?: GetServerSideProps<P, Q>
  requiredUserType?: UserType
  fetchUser?: boolean
}

export default function withPageAuthRequired<
  P extends { [key: string]: any },
  Q extends ParsedUrlQuery
>({
  getServerSideProps,
  requiredUserType,
  fetchUser,
}: Options<P, Q>): GetServerSideProps<PropsWithSession<P>, Q> {
  return async (ctx) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions
    )

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    const jwt = decodeJwt(session.accessToken)

    if (!jwt.sub) {
      throw new Error("Expected sub to be present in JWT")
    }

    const userType = jwt.sub.split(":")[0]

    if (requiredUserType !== undefined && userType !== requiredUserType) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    let props = {} as P

    if (getServerSideProps) {
      const res = await getServerSideProps(ctx)

      if ("redirect" in res || "notFound" in res) {
        return res
      }

      props = await res.props
    }

    let user: User | null = null

    if (fetchUser) {
      const server = await api(ctx)

      user =
        userType === "coach"
          ? { ...(await server.coachAccountGet()), type: "coach" }
          : { ...(await server.playerAccountGet()), type: "player" }
    }

    return {
      props: {
        session,
        user,
        ...props,
      },
    }
  }
}

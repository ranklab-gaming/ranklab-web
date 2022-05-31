import { ParsedUrlQuery } from "querystring"
import { GetServerSideProps } from "next"
import {
  Claims,
  getSession,
  withPageAuthRequired as withAuth0PageAuthRequired,
} from "@auth0/nextjs-auth0"
import jwt from "jsonwebtoken"

export type Props<P> = P & {
  auth: {
    claims: Claims
  }
}

export default function withPageAuthRequired<P, Q extends ParsedUrlQuery>(
  getServerSideProps?: GetServerSideProps<P, Q>
): GetServerSideProps<Props<P>, Q> {
  return withAuth0PageAuthRequired({
    async getServerSideProps(ctx) {
      const session = getSession(ctx.req, ctx.res)

      if (!session) {
        throw new Error("Session not present in request")
      }

      if (!session.accessToken) {
        throw new Error("Access token not present in session")
      }

      const claims = jwt.decode(session.accessToken, {
        json: true,
      })

      if (!claims) {
        throw new Error("Could not decode access token")
      }

      let props = {} as P

      if (getServerSideProps) {
        const res = await getServerSideProps(ctx)

        if ("redirect" in res || "notFound" in res) {
          return res
        }

        props = await res.props
      }

      return {
        props: {
          auth: {
            claims,
          },
          ...props,
        },
      }
    },
  })
}

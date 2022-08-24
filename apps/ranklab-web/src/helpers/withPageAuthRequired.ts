import { ParsedUrlQuery } from "querystring"
import { GetServerSideProps } from "next"
import {
  Claims,
  withPageAuthRequired as withAuth0PageAuthRequired,
} from "@auth0/nextjs-auth0"
import { getAccessToken } from "../utils/getAccessToken"

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
      const { claims } = await getAccessToken(ctx.req, ctx.res)

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

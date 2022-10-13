import { ParsedUrlQuery } from "querystring"
import { GetServerSideProps } from "next"
import { Session, unstable_getServerSession } from "next-auth"

export type Props<P> = P & {
  session?: Session
}

export default function withPageAuthRequired<
  P extends { [key: string]: any },
  Q extends ParsedUrlQuery
>(
  getServerSideProps?: GetServerSideProps<P, Q>
): GetServerSideProps<Props<P>, Q> {
  return async (ctx) => {
    const session = await unstable_getServerSession(ctx.req, ctx.res, {
      providers: [],
    })

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
        session,
        ...props,
      },
    }
  }
}

import { ResponseError, User } from "@ranklab/api"
import { GetServerSideProps, GetServerSidePropsResult } from "next"
import { PropsWithOptionalUser, PropsWithUser } from "../auth"
import { GetServerSidePropsContextWithSession, withSessionSsr } from "@/session"
import { ParsedUrlQuery } from "querystring"

type GetServerSidePropsContextWithOptionalUser<
  P extends ParsedUrlQuery = ParsedUrlQuery,
> = GetServerSidePropsContextWithSession<P> & { user: Promise<User> | null }

type GetServerSidePropsContextWithUser<
  P extends ParsedUrlQuery = ParsedUrlQuery,
> = GetServerSidePropsContextWithSession<P> & { user: Promise<User> | null }

type GetServerSidePropsWithOptionalUser<
  T extends { [key: string]: any },
  P extends ParsedUrlQuery = ParsedUrlQuery,
> = (
  ctx: GetServerSidePropsContextWithOptionalUser<P>,
) => Promise<GetServerSidePropsResult<T>>

type GetServerSidePropsWithUser<
  T extends { [key: string]: any },
  P extends ParsedUrlQuery = ParsedUrlQuery,
> = (
  ctx: GetServerSidePropsContextWithUser<P>,
) => Promise<GetServerSidePropsResult<T>>

export function withOptionalUserSsr<
  T extends { [key: string]: any },
  P extends ParsedUrlQuery = ParsedUrlQuery,
>(
  getServerSideProps: GetServerSidePropsWithOptionalUser<T, P>,
): GetServerSideProps<PropsWithOptionalUser<T>> {
  return withSessionSsr(async (ctx) => {
    const { getServerSession } = await import("./session")
    const { createServerApi } = await import("@/api/server")
    const session = await getServerSession(ctx.req)
    const api = await createServerApi(ctx.req)
    const fetchUser = session ? api.usersGet() : null

    let res

    try {
      res = await getServerSideProps({
        ...ctx,
        user: fetchUser,
      } as GetServerSidePropsContextWithOptionalUser<P>)
    } catch (e: unknown) {
      if (!(e instanceof ResponseError)) {
        throw e
      }

      if (e.response.status === 404) {
        return {
          notFound: true,
        }
      }

      if (e.response.status >= 500) {
        return {
          redirect: {
            destination: `/500?error=${e.message}`,
            permanent: false,
          },
        }
      }

      throw e
    }

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const [user, props] = await Promise.all([fetchUser, res.props])

    return {
      props: { ...props, user },
    }
  })
}

export function withUserSsr<
  T extends { [key: string]: any },
  P extends ParsedUrlQuery = ParsedUrlQuery,
>(
  getServerSideProps: GetServerSidePropsWithUser<T, P>,
): GetServerSideProps<PropsWithUser<T>> {
  return withOptionalUserSsr(async (ctx) => {
    const user = ctx.user
    const returnUrl = encodeURIComponent(ctx.resolvedUrl)

    if (!user) {
      return {
        redirect: {
          destination: `/api/auth/signin?return_url=${returnUrl}`,
          permanent: false,
        },
      }
    }

    return getServerSideProps({
      ...ctx,
      user,
    } as GetServerSidePropsContextWithUser<P>)
  }) as GetServerSideProps<PropsWithUser<T>>
}

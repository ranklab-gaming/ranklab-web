import { ResponseError, User } from "@ranklab/api"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import { PropsWithOptionalUser, PropsWithUser } from "../auth"
import { withSessionSsr } from "@/session"

type GetServerSidePropsWithOptionalUser<P extends { [key: string]: any }> = (
  ctx: GetServerSidePropsContext & { user: Promise<User> | null }
) => Promise<GetServerSidePropsResult<P>>

type GetServerSidePropsWithUser<P extends { [key: string]: any }> = (
  ctx: GetServerSidePropsContext & { user: Promise<User> }
) => Promise<GetServerSidePropsResult<P>>

export function withOptionalUserSsr<P extends { [key: string]: any }>(
  getServerSideProps: GetServerSidePropsWithOptionalUser<P>
): GetServerSideProps<PropsWithOptionalUser<P>> {
  return withSessionSsr(async (ctx) => {
    const { getServerSession } = await import("./session")
    const { createServerApi } = await import("@/api/server")
    const session = await getServerSession(ctx.req)
    const api = await createServerApi(ctx.req)
    const fetchUser = session ? api.usersGet() : null

    let res

    try {
      res = await getServerSideProps({ ...ctx, user: fetchUser })
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

export function withUserSsr<P extends { [key: string]: any }>(
  getServerSideProps: GetServerSidePropsWithUser<P>
): GetServerSideProps<PropsWithUser<P>> {
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

    return await getServerSideProps({
      ...ctx,
      user,
    })
  }) as GetServerSideProps<PropsWithUser<P>>
}

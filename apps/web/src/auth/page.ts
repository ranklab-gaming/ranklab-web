import AWSXRay from "aws-xray-sdk"
import middleware from "aws-xray-sdk-express"
import * as https from "https"

if (nodeEnv === "production") {
  AWSXRay.captureHTTPsGlobal(https)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  AWSXRay.setContextMissingStrategy(() => {})
}

import { Coach, Player, ResponseError, UserType } from "@ranklab/api"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import { CoachUser, PlayerUser, PropsWithUser } from "../auth"
import { withSessionSsr } from "@/session"
import { nodeEnv } from "@/config"

function userFromCoach(coach: Coach): CoachUser {
  return { ...coach, type: "coach" }
}

function userFromPlayer(player: Player): PlayerUser {
  return { ...player, type: "player" }
}

type GetServerSidePropsWithUser<P extends { [key: string]: any }> = (
  ctx: PropsWithUser<GetServerSidePropsContext>
) => Promise<GetServerSidePropsResult<P>>

export function withUserSsr<P extends { [key: string]: any }>(
  userType: UserType,
  getServerSideProps: GetServerSidePropsWithUser<P>
): GetServerSideProps<PropsWithUser<P>> {
  return withSessionSsr(
    async (
      ctx: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<PropsWithUser<P>>> => {
      if (nodeEnv === "production") {
        const xrayMiddleware = middleware.openSegment("ranklab-web")

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        xrayMiddleware(ctx.req as any, ctx.res as any, () => {})
      }

      const { getServerSession } = await import("./session")
      const { createServerApi } = await import("@/api/server")
      const session = await getServerSession(ctx.req)
      const api = await createServerApi(ctx.req)
      const returnUrl = encodeURIComponent(ctx.resolvedUrl)

      if (!session) {
        return {
          redirect: {
            destination: `/api/auth/signin?user_type=${userType}&return_url=${returnUrl}`,
            permanent: false,
          },
        }
      }

      if (session.userType !== userType) {
        return {
          redirect: {
            destination: `/api/auth/logout?return_url=${returnUrl}`,
            permanent: false,
          },
        }
      }

      const user =
        userType === "coach"
          ? userFromCoach(await api.coachAccountGet())
          : userFromPlayer(await api.playerAccountGet())

      let res

      try {
        res = await getServerSideProps({ ...ctx, user })
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

      const props = await res.props

      return {
        props: { ...props, user },
      }
    }
  )
}

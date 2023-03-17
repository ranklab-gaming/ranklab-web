import { Coach, Player, ResponseError, UserType } from "@ranklab/api"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import { CoachUser, PlayerUser, PropsWithUser } from "@/auth"
import { withSessionSsr } from "@/session"

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
      const { getServerSession } = await import("./session")
      const { createServerApi } = await import("@/api/server")
      const session = await getServerSession(ctx.req, ctx.res)
      const api = await createServerApi(ctx)
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
      } catch (e) {
        if (!(e instanceof ResponseError) || e.response.status !== 404) {
          throw e
        }

        return {
          notFound: true,
        }
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

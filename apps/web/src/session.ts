import { IronSessionOptions } from "iron-session"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { GetServerSideProps, NextApiHandler } from "next"

export interface SessionReview {
  recordingId?: string
  coachId?: string
  notes?: string
}

async function getSessionOptions(): Promise<IronSessionOptions> {
  const { cookieSecret, nodeEnv } = await import("@/config/server")

  return {
    password: cookieSecret,
    cookieName: "_ranklab_session",
    cookieOptions: {
      secure: nodeEnv === "production",
    },
  }
}

export function withSessionApiRoute<T>(
  handler: NextApiHandler<T>
): NextApiHandler<T> {
  return async (req, res) => {
    return withIronSessionApiRoute(handler, await getSessionOptions())(req, res)
  }
}

export function withSessionSsr<T extends { [key: string]: any }>(
  handler: GetServerSideProps<T>
): GetServerSideProps<T> {
  return async (ctx) => {
    return withIronSessionSsr(handler, await getSessionOptions())(ctx)
  }
}

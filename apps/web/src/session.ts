import { IncomingMessage, ServerResponse } from "http"
import { IronSession, SessionOptions, getIronSession } from "iron-session"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { ParsedUrlQuery } from "querystring"
import { nodeEnv } from "./config"

export type Session = IronSession<{
  accessToken?: string
  refreshToken?: string
  codeVerifier?: string
  federatedCodeVerifier?: string
  returnUrl?: string
}>

export type RequestWithSession<T extends IncomingMessage = IncomingMessage> =
  T & {
    session: Session
  }

export type GetServerSidePropsContextWithSession<
  T extends ParsedUrlQuery = ParsedUrlQuery,
> = GetServerSidePropsContext<T> & {
  req: RequestWithSession<GetServerSidePropsContext<T>["req"]>
}

export type GetServerSidePropsWithSession<T extends ParsedUrlQuery> = (
  context: GetServerSidePropsContextWithSession<T>,
) => Promise<GetServerSidePropsResult<T>>

async function getSessionOptions(): Promise<SessionOptions> {
  const { cookieSecret } = await import("@/config/server")

  return {
    password: cookieSecret,
    cookieName: "_ranklab_session",
    cookieOptions: {
      secure: nodeEnv === "production",
    },
  }
}

async function requestWithSession<T extends IncomingMessage = IncomingMessage>(
  req: T,
  res: ServerResponse,
): Promise<RequestWithSession<T>> {
  const reqWithSession = req as RequestWithSession<T>

  reqWithSession.session = await getIronSession<Session>(
    req,
    res,
    await getSessionOptions(),
  )

  return reqWithSession
}

export function withSessionApiRoute<T>(
  handler: (
    req: RequestWithSession<NextApiRequest>,
    res: NextApiResponse<T>,
  ) => unknown | Promise<unknown>,
): NextApiHandler<T> {
  return async (req, res) => {
    return handler(await requestWithSession(req, res), res)
  }
}

export function withSessionSsr<T extends { [key: string]: any }>(
  handler: GetServerSidePropsWithSession<T>,
): GetServerSideProps<T> {
  return async (ctx) => {
    const reqWithSession = await requestWithSession(ctx.req, ctx.res)
    const ctxWithSession = ctx as GetServerSidePropsContextWithSession<T>

    ctxWithSession.req = reqWithSession

    return await handler(ctxWithSession)
  }
}

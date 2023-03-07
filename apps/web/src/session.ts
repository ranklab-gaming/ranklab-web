import { cookieSecret, nodeEnv } from "@/config/server"
import { IronSessionOptions } from "iron-session"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { GetServerSideProps, NextApiHandler } from "next"

export const sessionOptions: IronSessionOptions = {
  password: cookieSecret,
  cookieName: "_ranklab_session",
  cookieOptions: {
    secure: nodeEnv === "production",
  },
}

export function withSessionApiRoute<T>(handler: NextApiHandler<T>) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr<T extends { [key: string]: any }>(
  handler: GetServerSideProps<T>
) {
  return withIronSessionSsr(handler, sessionOptions)
}

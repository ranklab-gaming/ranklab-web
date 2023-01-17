import { NextApiRequest, NextApiResponse } from "next"

const COOKIES = [
  "_session",
  "_session.sig",
  "_session.legacy",
  "_session.legacy.sig",
  "next-auth.session-token",
]

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "POST"].includes(req.method ?? "")) {
    return res.status(405).end()
  }

  res.setHeader(
    "Set-Cookie",
    COOKIES.map((cookie) => `${cookie}=; Max-Age=0; Path=/; HttpOnly`)
  )

  if (req.query.error) {
    return res.redirect(`/?error=${req.query.error}`).end()
  }

  return res.redirect("/").end()
}

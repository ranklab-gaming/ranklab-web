import { NextApiRequest, NextApiResponse } from "next"

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const cookies = [
    "_session",
    "_session.sig",
    "_session.legacy",
    "_session.legacy.sig",
    "next-auth.session-token",
  ]

  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie) => `${cookie}=; Max-Age=0; Path=/; HttpOnly`)
  )

  return res.redirect("/").end()
}

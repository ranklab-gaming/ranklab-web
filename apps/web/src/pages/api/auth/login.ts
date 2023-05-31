import { NextApiRequest, NextApiResponse } from "next"
import { finishInteraction } from "@/oidc/interaction"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const location = await finishInteraction(req.body.token, req, res)

  if (typeof location === "string") {
    return res.status(200).json({ location })
  }

  return location
}

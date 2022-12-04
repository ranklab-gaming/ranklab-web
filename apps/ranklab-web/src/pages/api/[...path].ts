import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

export default async function proxy(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    const token = session?.accessToken
    const baseURL = process.env.API_HOST

    if (!baseURL) {
      throw new Error("Expected API_HOST to be present")
    }

    if (!req.url) {
      throw new Error("Expected url to be present in query")
    }

    const params = {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: req.headers.accept!,
        "Content-Type": req.headers["content-type"]!,
      },
    } as any

    if (req.method !== "GET") {
      params.body = JSON.stringify(req.body)
    }

    const response = await fetch(
      `${baseURL}${req.url.replace("/api", "")}`,
      params
    )

    const json = await response.json()
    res.status(response.status || 200).json(json)
  } catch (error: any) {
    console.error(error)

    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { ServerApi } from "@/api/server"
import { HTTPMethod, JSONApiResponse, ResponseError } from "@ranklab/api"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const token = session?.accessToken
  const api = new ServerApi(token)
  const { query, method, headers, body } = req
  const path = Array.isArray(query.path) ? query.path.join("/") : query.path

  delete query.path

  try {
    const response = await api.request({
      path: `/${path}`,
      query: query as Record<string, string>,
      method: method as HTTPMethod,
      headers: {
        host: headers.host,
        "user-agent": headers["user-agent"],
        accept: headers.accept,
        "accept-language": headers["accept-language"],
        "accept-encoding": headers["accept-encoding"],
        referer: headers.referer,
        origin: headers.origin,
      } as Record<string, string>,
      body,
    })

    const value = await new JSONApiResponse(response).value()
    res.status(response.status).json(value)
  } catch (e: unknown) {
    if (e instanceof ResponseError) {
      return res.status(e.response.status).json(await e.response.json())
    }

    throw e
  }
}

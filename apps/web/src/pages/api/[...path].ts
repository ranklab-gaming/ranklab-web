import AWSXRay from "aws-xray-sdk"
import * as http from "http"

AWSXRay.captureHTTPsGlobal(http, true)

import { ServerApi } from "@/api/server"
import { HTTPMethod, JSONApiResponse, ResponseError } from "@ranklab/api"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const api = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const segment = new AWSXRay.Segment("web")

  segment.addIncomingRequestData(
    new AWSXRay.middleware.IncomingRequestData(req)
  )

  AWSXRay.setSegment(segment)

  const session = await getServerSession(req)
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
      body: ["GET", "HEAD"].includes(method as string) ? undefined : body,
    })

    const value = await new JSONApiResponse(response).value()
    res.status(response.status).json(value)
  } catch (e: unknown) {
    if (e instanceof ResponseError) {
      return res.status(e.response.status).json(await e.response.json())
    }

    throw e
  } finally {
    segment.close()
  }
})

export default api

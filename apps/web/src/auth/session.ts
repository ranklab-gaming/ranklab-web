import { authClientSecret, webHost } from "@/config/server"
import { UserType } from "@ranklab/api"
import { IncomingMessage, ServerResponse } from "http"
import { decodeJwt, JWTPayload } from "jose"
import { Client, Issuer } from "openid-client"

let issuer: Issuer<Client> | null = null
let client: Client | null = null

async function getIssuer() {
  if (issuer) {
    return issuer
  }

  issuer = await Issuer.discover(`${webHost}/api/oidc`)
  return issuer
}

export async function getAuthClient() {
  if (client) {
    return client
  }

  const issuer = await getIssuer()

  client = new issuer.Client({
    client_id: "web",
    client_secret: authClientSecret,
    redirect_uris: [`${webHost}/api/auth/callback`],
    response_types: ["code"],
  })

  return client
}

export function sessionFromToken(token?: string) {
  if (!token) {
    return null
  }

  const payload = decodeJwt(token)

  if (!payload.sub) {
    throw new Error("sub is missing from JWT")
  }

  const userType = payload.sub.split(":")[0]

  if (!["coach", "player"].includes(userType)) {
    throw new Error(`invalid user type: ${userType}`)
  }

  return {
    userType: userType as UserType,
    accessToken: token,
    payload,
  }
}

export async function destroyServerSession(req: IncomingMessage) {
  delete req.session.accessToken
  delete req.session.refreshToken
  delete req.session.codeVerifier
  await req.session.save()
}

export async function getServerSession(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  const accessToken = req.session?.accessToken
  const session = sessionFromToken(accessToken)

  if (!session) {
    return null
  }

  if ((session.payload.exp ?? 0) < Date.now()) {
    const client = await getAuthClient()
    const refreshToken = req.session?.refreshToken

    if (!refreshToken) {
      throw new Error("refresh token is missing")
    }

    try {
      const tokenSet = await client.refresh(refreshToken)

      req.session.accessToken = tokenSet.access_token
      req.session.refreshToken = tokenSet.refresh_token
      await req.session.save()

      return sessionFromToken(tokenSet.access_token)
    } catch (e) {
      console.error(e)
      await destroyServerSession(req)

      res
        .writeHead(302, { Location: `/api/auth/login?${session.userType}` })
        .end()

      return null
    }
  }

  return session
}

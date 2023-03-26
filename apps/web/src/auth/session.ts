import { assertProp } from "@/assert"
import { authClientSecret, webHost } from "@/config/server"
import { UserType } from "@ranklab/api"
import { IncomingMessage, ServerResponse } from "http"
import { decodeJwt } from "jose"
import { Client, Issuer, errors } from "openid-client"

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
  const sub = assertProp(payload, "sub")
  const userType = sub.split(":")[0]

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

  if ((session.payload.exp ?? 0) * 1000 < Date.now()) {
    const client = await getAuthClient()
    const refreshToken = assertProp(req.session, "refreshToken")

    try {
      const tokenSet = await client.refresh(refreshToken)

      req.session.accessToken = tokenSet.access_token
      req.session.refreshToken = tokenSet.refresh_token
      await req.session.save()

      return sessionFromToken(tokenSet.access_token)
    } catch (e: unknown) {
      if (e instanceof errors.OPError) {
        if (e.error === "invalid_grant") {
          await destroyServerSession(req)

          res
            .writeHead(302, {
              Location: `/api/auth/signin?${new URLSearchParams({
                user_type: session.userType,
                return_url: req.url ?? "/",
              })}`,
            })
            .end()
        }

        return null
      }

      throw e
    }
  }

  return session
}

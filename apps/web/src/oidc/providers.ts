import { host, twitchClientId, twitchClientSecret } from "@/config/server"
import { Client, Issuer } from "openid-client"

interface Config {
  discoveryUrl: string
  clientId: string
  clientSecret: string
  scope: string
}

const configs: Record<string, Config | undefined> = {
  twitch: {
    discoveryUrl:
      "https://id.twitch.tv/oauth2/.well-known/openid-configuration",
    clientId: twitchClientId,
    clientSecret: twitchClientSecret,
    scope: "openid",
  },
}

const clientsCache: Record<string, Client | undefined> = {}

export function getConfig(provider: string) {
  const config = configs[provider]

  if (!config) {
    return null
  }

  return config
}

export async function getClient(provider: string) {
  const config = getConfig(provider)

  if (!config) {
    return null
  }

  let client = clientsCache[provider]

  if (client) {
    return client
  }

  const issuer = await Issuer.discover(config.discoveryUrl)

  client = new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uris: [`${host}/api/auth/federated/callback/${provider}`],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  })

  clientsCache[provider] = client

  return client
}

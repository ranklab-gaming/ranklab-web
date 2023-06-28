import "iron-session"

declare module "iron-session" {
  interface IronSessionData {
    accessToken?: string
    refreshToken?: string
    codeVerifier?: string
    federatedCodeVerifier?: string
    returnUrl?: string
  }
}

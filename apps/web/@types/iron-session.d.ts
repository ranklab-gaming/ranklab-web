import "iron-session"

declare module "iron-session" {
  interface IronSessionData {
    accessToken?: string
    refreshToken?: string
    codeVerifier?: string
    returnUrl?: string
  }
}

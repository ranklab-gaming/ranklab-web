import * as ironSession from "iron-session"

declare module "iron-session" {
  interface IronSessionData {
    postLogoutReturnUrl?: string
  }
}

import { UserType } from "@ranklab/api"
import { JWTPayload } from "jose"
import * as nextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    userType?: UserType
    payload?: JWTPayload
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    userType?: UserType
    payload?: JWTPayload
  }
}

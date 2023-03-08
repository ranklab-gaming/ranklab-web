import { UserType } from "@ranklab/api"
import { JWTPayload } from "jose"
import "next-auth"

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

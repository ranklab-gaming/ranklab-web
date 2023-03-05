import * as nextAuth from "next-auth"

declare module "next-auth" {
  export interface Session {
    accessToken: string
  }

  export interface User {
    id: string
  }
}

import { UserType } from "@ranklab/api"
import { decodeJwt } from "jose"
import { GetServerSidePropsContext } from "next"
import { Session } from "next-auth"
import { ParsedUrlQuery } from "querystring"

export function getParam<T extends ParsedUrlQuery>(
  ctx: GetServerSidePropsContext<T>,
  name: string
) {
  const param = ctx.query[name]
  return Array.isArray(param) ? param.join(",") : param ?? null
}

export function getSessionUserType(session: Session): UserType {
  const jwt = decodeJwt(session.accessToken)

  if (!jwt.sub) {
    throw new Error("sub is missing from jwt")
  }

  const userType = jwt.sub.split(":")[0]

  if (!["coach", "player"].includes(userType)) {
    throw new Error("invalid user type in jwt: " + userType)
  }

  return userType as UserType
}

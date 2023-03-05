import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { UserType } from "@ranklab/api"
import { decodeJwt } from "jose"
import { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth"
import { ParsedUrlQuery } from "querystring"

export function getParam<T extends ParsedUrlQuery>(
  ctx: GetServerSidePropsContext<T>,
  name: string
) {
  const param = ctx.query[name]
  return Array.isArray(param) ? param.join(",") : param ?? null
}

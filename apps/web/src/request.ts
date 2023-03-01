import type { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"

export function getParam<T extends ParsedUrlQuery>(
  ctx: GetServerSidePropsContext<T>,
  name: string
) {
  const param = ctx.query[name]
  return Array.isArray(param) ? param.join(",") : param ?? null
}

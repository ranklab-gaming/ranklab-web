import type { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"

export function useRequiredParam<
  Q extends ParsedUrlQuery,
  D extends PreviewData
>(ctx: GetServerSidePropsContext<Q, D>, paramName: string) {
  const param = useParam(ctx, paramName)

  if (!param) {
    throw new Error(`Missing required param ${paramName}`)
  }

  return param
}

export function useParam<Q extends ParsedUrlQuery, D extends PreviewData>(
  ctx: GetServerSidePropsContext<Q, D>,
  paramName: string
) {
  const param = ctx.query[paramName]

  if (!param) {
    return null
  }

  return Array.isArray(param) ? param.join(",") : param
}

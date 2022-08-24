import { User } from "@ranklab/api"
import { ParsedUrlQuery } from "querystring"
import withPageAuthRequired, {
  Props as PropsWithAuth,
} from "./withPageAuthRequired"
import { GetServerSideProps } from "next"
import api from "../api"

export type Props<P> = P &
  PropsWithAuth<{
    auth: {
      user: User
    }
  }>

export default function withPageOnboardingRequired<P, Q extends ParsedUrlQuery>(
  userType: "Coach" | "Player",
  getServerSideProps?: GetServerSideProps<P, Q>
): GetServerSideProps<Props<P>, Q> {
  return async (ctx) => {
    const res = await withPageAuthRequired()(ctx)

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const authProps = await res.props

    let user

    try {
      user = await (await api.server(ctx)).userMeGetMe()
    } catch (err: any) {
      if (err instanceof Response && err.status === 404) {
        return {
          redirect: {
            destination: `/${userType.toLowerCase()}/onboarding`,
            statusCode: 302,
          },
        }
      } else {
        throw err
      }
    }

    if (user.type !== userType) {
      return {
        redirect: {
          destination: "/",
          statusCode: 302,
        },
      }
    }

    let props = {} as P

    if (getServerSideProps) {
      const res = await getServerSideProps(ctx)

      if ("redirect" in res || "notFound" in res) {
        return res
      }

      props = await res.props
    }

    return {
      props: {
        auth: {
          ...authProps.auth,
          user,
        },
        ...props,
      },
    }
  }
}

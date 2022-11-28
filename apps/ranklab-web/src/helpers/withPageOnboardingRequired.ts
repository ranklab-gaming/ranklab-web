import { UserType } from "@ranklab/api"
import { ParsedUrlQuery } from "querystring"
import { GetServerSideProps } from "next"
import api from "../api/server"
import { User } from "../@types"

export type Props<P> = P & {
  auth: {
    user: User
  }
}

export default function withPageOnboardingRequired<
  P extends { [key: string]: any },
  Q extends ParsedUrlQuery
>(
  userType: UserType,
  getServerSideProps?: GetServerSideProps<P, Q>
): GetServerSideProps<Props<P>, Q> {
  return async (ctx) => {
    let user: User

    try {
      user =
        userType === "player"
          ? {
              type: "player",
              ...(await (await api(ctx)).playerAccountGet()),
            }
          : {
              type: "coach",
              ...(await (await api(ctx)).coachAccountGet()),
            }
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
          user,
        },
        ...props,
      },
    }
  }
}

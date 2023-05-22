import { PlayerSignupPage } from "@/player/components/SignupPage"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"

interface Props {
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { getOidcProvider, errors } = await import(
    "@ranklab/server/dist/oidc/provider"
  )

  const oidcProvider = await getOidcProvider()

  try {
    oidcProvider.interactionDetails(ctx.req, ctx.res)
  } catch (e) {
    if (e instanceof errors.SessionNotFound) {
      return {
        redirect: {
          destination: "/api/auth/signin?intent=signup",
          permanent: false,
        },
      }
    }

    throw e
  }

  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.playerGamesList()

  return {
    props: {
      games,
    },
  }
}

export default function (props: Props) {
  return <PlayerSignupPage games={props.games} />
}

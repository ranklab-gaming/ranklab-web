import { withOidcInteraction } from "@/oidc"
import { PlayerSignupPage } from "@/player/components/SignupPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withOidcInteraction<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.playerGamesList()

  return {
    props: {
      games,
    },
  }
})

export default function (props: Props) {
  return <PlayerSignupPage games={props.games} />
}

import { withOidcInteraction } from "@/oidc"
import { PlayerSignupPage } from "@/player/components/SignupPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
  token: string | null
}

export const getServerSideProps = withOidcInteraction<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.playerGamesList()

  const token = Array.isArray(ctx.query.token)
    ? ctx.query.token[0]
    : ctx.query.token

  return {
    props: {
      games,
      token: token ?? null,
    },
  }
})

export default function (props: Props) {
  return (
    <PlayerSignupPage games={props.games} token={props.token ?? undefined} />
  )
}

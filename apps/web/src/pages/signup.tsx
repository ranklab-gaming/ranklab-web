import { withOidcInteraction } from "@/oidc"
import { SignupPage } from "@/components/SignupPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
  token: string | null
}

export const getServerSideProps = withOidcInteraction<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.gamesList()

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
  return <SignupPage games={props.games} token={props.token ?? undefined} />
}

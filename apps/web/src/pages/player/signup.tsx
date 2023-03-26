import { PlayerSignupPage } from "@/player/components/SignupPage"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"

interface Props {
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const games = await api.gameList()

  return {
    props: {
      games,
    },
  }
}

export default function (props: Props) {
  return <PlayerSignupPage games={props.games} />
}

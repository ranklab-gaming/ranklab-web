import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { createServerApi } from "@/api/server"
import { PlayerSignupPage } from "@/components/PlayerSignupPage"

interface Props {
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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

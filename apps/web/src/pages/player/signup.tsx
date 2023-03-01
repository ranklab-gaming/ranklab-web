import { Container } from "@mui/material"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { BasicLayout } from "@/components/BasicLayout"
import { createServerApi } from "@/api/server"
import { PlayerSignupForm } from "@/components/PlayerSignupForm"

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
  return (
    <BasicLayout>
      <Container>
        <PlayerSignupForm games={props.games} />
      </Container>
    </BasicLayout>
  )
}

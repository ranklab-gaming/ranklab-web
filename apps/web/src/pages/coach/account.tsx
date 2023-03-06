import { Game } from "@ranklab/api"
import {
  PropsWithUser,
  withPageUserRequired,
} from "@/server/withPageUserRequired"
import { createServerApi } from "@/api/server"
import { CoachAccountPage } from "@/components/CoachAccountPage"

interface Props {
  games: Game[]
}

export const getServerSideProps = withPageUserRequired<Props>(
  "coach",
  async (ctx) => {
    const api = await createServerApi(ctx)

    return {
      props: {
        games: await api.gameList(),
      },
    }
  }
)

export default function ({ games, user }: PropsWithUser<Props>) {
  return <CoachAccountPage games={games} user={user} />
}

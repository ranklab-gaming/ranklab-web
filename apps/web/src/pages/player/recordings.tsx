import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerRecordingsPage } from "@/player/components/RecordingsPage"
import { Game, Recording } from "@ranklab/api"

interface Props {
  recordings: Recording[]
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const recordings = await api.playerRecordingsList()
  const games = await api.gameList()

  return {
    props: {
      recordings,
      games,
    },
  }
})

export default function ({ recordings, user, games }: PropsWithUser<Props>) {
  return (
    <PlayerRecordingsPage recordings={recordings} user={user} games={games} />
  )
}

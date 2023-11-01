import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { RecordingList } from "@/components/RecordingList"
import { Game, PaginatedResultForRecording } from "@ranklab/api"
import { MessageBox } from "./MessageBox"
import { Iconify } from "./Iconify"
import { assertFind } from "@/assert"
import { FollowGameButton } from "./FollowGameButton"
import { useEffect, useState } from "react"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
  gameId: string
}

export const DashboardPage = ({
  recordings,
  games,
  user,
  gameId,
}: PropsWithOptionalUser<Props>) => {
  const initialGame = assertFind(games, (game) => game.id === gameId)
  const [game, setGame] = useState(initialGame)

  useEffect(() => {
    setGame(initialGame)
  }, [initialGame])

  return (
    <DashboardLayout
      user={user}
      title={game.name}
      games={games}
      action={<FollowGameButton game={game} onChange={setGame} />}
    >
      {recordings.count === 0 ? (
        <MessageBox
          icon={<Iconify icon="eva:video-outline" width={64} height={64} />}
          text="There are no VODs for this game yet."
          actionText="Submit your VOD"
          href="/recordings/new"
          sx={{ mt: 2 }}
        />
      ) : (
        <RecordingList recordings={recordings} games={games} />
      )}
    </DashboardLayout>
  )
}

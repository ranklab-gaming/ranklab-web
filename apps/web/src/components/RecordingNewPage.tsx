import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useGameDependency } from "@/hooks/useGameDependency"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const RecordingNewPage = ({ user, games }: PropsWithUser<Props>) => {
  const RecordingForm = useGameDependency(
    "component:recording-form",
    user.gameId
  )

  const recordingPageTitle = useGameDependency(
    "text:create-recording-button",
    user.gameId
  )

  return (
    <DashboardLayout user={user} title={recordingPageTitle}>
      <RecordingForm games={games} />
    </DashboardLayout>
  )
}

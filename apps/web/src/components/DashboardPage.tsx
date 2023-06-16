import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { RecordingList } from "@/components/RecordingList"
import { useGameDependency } from "@/hooks/useGameDependency"
import { Game, PaginatedResultForRecording } from "@ranklab/api"
import { MessageBox } from "./MessageBox"
import { cloneElement } from "react"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
}

export const DashboardPage = ({
  recordings,
  games,
  user,
}: PropsWithUser<Props>) => {
  const createButtonText = useGameDependency("text:create-recording-button")
  const recordingPlural = useGameDependency("text:recording-plural")
  const icon = useGameDependency("component:recording-icon")
  const sizedIcon = cloneElement(icon, { width: 64, height: 64 })

  return (
    <DashboardLayout user={user} title="Dashboard">
      {recordings.count === 0 ? (
        <MessageBox
          icon={sizedIcon}
          text={`There are no ${recordingPlural} for this game yet.`}
          actionText={createButtonText}
          href="/recordings/new"
        />
      ) : (
        <RecordingList recordings={recordings} games={games} />
      )}
    </DashboardLayout>
  )
}

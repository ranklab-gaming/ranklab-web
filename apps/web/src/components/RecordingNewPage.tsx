import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Game } from "@ranklab/api"
import { RecordingForm } from "./RecordingForm"

interface Props {
  games: Game[]
}

export const RecordingNewPage = ({ user, games }: PropsWithUser<Props>) => {
  return (
    <DashboardLayout user={user} title="Submit your VOD" games={games}>
      <RecordingForm games={games} />
    </DashboardLayout>
  )
}

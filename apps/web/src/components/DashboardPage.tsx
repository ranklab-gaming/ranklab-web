import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { RecordingList } from "@/components/RecordingList"
import { Game, PaginatedResultForRecording } from "@ranklab/api"
import { MessageBox } from "./MessageBox"
import { Iconify } from "./Iconify"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
}

export const DashboardPage = ({
  recordings,
  games,
  user,
}: PropsWithOptionalUser<Props>) => {
  return (
    <DashboardLayout user={user} title="Dashboard">
      {recordings.count === 0 ? (
        <MessageBox
          icon={<Iconify icon="eva:video-outline" width={64} height={64} />}
          text="There are no VODs for this game yet."
          actionText="Submit your VOD"
          href="/recordings/new"
        />
      ) : (
        <RecordingList recordings={recordings} games={games} />
      )}
    </DashboardLayout>
  )
}

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

export const RecordingsPage = ({
  recordings,
  games,
  user,
}: PropsWithOptionalUser<Props>) => {
  return (
    <DashboardLayout user={user} title="Your VODs" games={games}>
      {recordings.count === 0 ? (
        <MessageBox
          icon={<Iconify icon="eva:video-outline" width={64} height={64} />}
          text={"You haven't submitted any VODs yet."}
          actionText="Submit your VOD"
          href="/recordings/new"
        />
      ) : (
        <RecordingList
          recordings={recordings}
          games={games}
          queryParams={{ onlyOwn: true }}
        />
      )}
    </DashboardLayout>
  )
}

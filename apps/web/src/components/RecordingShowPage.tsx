import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "./DashboardLayout"
import { Game, Comment, Recording } from "@ranklab/api"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  recording: Recording
  games: Game[]
  comments: Comment[]
}

export const RecordingShowPage = ({
  recording,
  games,
  comments,
  user,
}: PropsWithOptionalUser<Props>) => {
  const ReviewForm = useGameDependency("component:review-form")

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
    >
      <ReviewForm recording={recording} games={games} comments={comments} />
    </DashboardLayout>
  )
}

import { Game, Recording, Comment } from "@ranklab/api"
import { ExploreLayout } from "./ExploreLayout"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  games: Game[]
  recording: Recording
  comments: Comment[]
}

export function ExploreRecordingPage({ recording, games, comments }: Props) {
  const ExploreReview = useGameDependency("component:explore-review")
  return (
    <ExploreLayout games={games} title={recording.title} showTitle={false}>
      <ExploreReview recording={recording} games={games} comments={comments} />
    </ExploreLayout>
  )
}

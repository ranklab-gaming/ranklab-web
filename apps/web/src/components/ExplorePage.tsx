import { Game, PaginatedResultForRecording } from "@ranklab/api"
import { ExploreLayout } from "./ExploreLayout"
import { RecordingList } from "./RecordingList"

interface Props {
  games: Game[]
  recordings: PaginatedResultForRecording
  title: string
}

export function ExplorePage({ games, recordings, title }: Props) {
  return (
    <ExploreLayout games={games} title={title}>
      <RecordingList recordings={recordings} games={games} explore />
    </ExploreLayout>
  )
}

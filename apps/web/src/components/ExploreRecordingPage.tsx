import { Game, Recording } from "@ranklab/api"
import { ExploreLayout } from "./ExploreLayout"

interface Props {
  games: Game[]
  recording: Recording
}

export function ExploreRecordingPage({ recording, games }: Props) {
  return <ExploreLayout games={games} title={recording.title}></ExploreLayout>
}

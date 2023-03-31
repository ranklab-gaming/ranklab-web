import { LandingPage } from "@/components/LandingPage"
import { Game } from "@ranklab/api"

interface IndexProps {
  games: Game[]
}

export async function getStaticProps() {
  const { ServerApi } = await import("@/api/server")
  const api = new ServerApi()
  const games = await api.gameList()

  return {
    props: {
      games,
    },
  }
}

export default function ({ games }: IndexProps) {
  return <LandingPage games={games} />
}

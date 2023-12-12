import { host } from "@/config"
import { withSessionSsr } from "@/session"
import { Game, Recording } from "@ranklab/api"

const KNOWN_URLS = ["", "/directory"]

function generateSiteMap({
  games,
  recordings,
}: {
  games: Game[]
  recordings: Recording[]
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${KNOWN_URLS.map(
        (url) => `<url><loc>${`${host}${url}`}</loc></url>`,
      ).join("")}
      ${games
        .map(({ id }) => `<url><loc>${`${host}/directory/${id}`}</loc></url>`)
        .join("")}
     ${recordings
       .map(({ id }) => `<url><loc>${`${host}/recordings/${id}`}</loc></url>`)
       .join("")}
   </urlset>
 `
}

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(req)
  const games = await api.gamesList()

  const recordings = (
    await Promise.all(
      games.map(
        async (game) => (await api.recordingsList({ gameId: game.id })).records,
      ),
    )
  ).flat()

  const sitemap = generateSiteMap({ games, recordings })

  res.setHeader("Content-Type", "text/xml")
  res.write(sitemap)
  res.end()

  return { props: {} }
})

export default function () {}

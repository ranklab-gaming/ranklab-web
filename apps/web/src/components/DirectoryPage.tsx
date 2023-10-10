import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Game } from "@ranklab/api"
import { Box, Card, CardContent, CardHeader, Stack } from "@mui/material"
import { GameIcon } from "./GameIcon"
import Link from "next/link"

interface Props {
  games: Game[]
}

export const DirectoryPage = ({
  games,
  user,
}: PropsWithOptionalUser<Props>) => {
  return (
    <DashboardLayout user={user} title="Directory" games={games}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {games.map((game) => (
          <Card key={game.id} sx={{ width: "100%" }}>
            <CardHeader title={game.name} />
            <CardContent>
              <Link href={`/directory/${game.id}`}>
                <GameIcon game={game} />
              </Link>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </DashboardLayout>
  )
}

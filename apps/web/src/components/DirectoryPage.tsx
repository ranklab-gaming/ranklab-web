import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Game } from "@ranklab/api"
import {
  Card,
  CardActionArea,
  CardContent,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material"
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
      <List>
        {games.map((game) => {
          return (
            <ListItem key={game.id} sx={{ p: 0, m: 0, mb: 2 }}>
              <Card sx={{ width: "100%" }}>
                <Link href={`/directory/${game.id}`} passHref legacyBehavior>
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <GameIcon game={game} />
                        <Typography variant="h6">{game.name}</Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </ListItem>
          )
        })}
      </List>
    </DashboardLayout>
  )
}

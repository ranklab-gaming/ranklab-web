import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Iconify } from "@/components/Iconify"
import { RecordingList } from "./RecordingList"
import { Box, Button, Paper, Typography } from "@mui/material"
import { Game, Recording } from "@ranklab/api"
import NextLink from "next/link"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  recordings: Recording[]
  games: Game[]
}

export const PlayerRecordingsPage = ({
  recordings,
  games,
  user,
}: PropsWithUser<Props>) => {
  const recordingsTitle = useGameDependency("text:recordings-title")
  const recordingsEmptyText = useGameDependency("text:recordings-empty-text")

  return (
    <DashboardLayout user={user} title={recordingsTitle}>
      {recordings.length === 0 ? (
        <Paper>
          <Box p={2}>
            <Box textAlign="center" p={8}>
              <Iconify icon="eva:video-outline" width={40} height={40} />
              <Typography variant="h3" component="h1" gutterBottom>
                No {recordingsTitle} Yet
              </Typography>
              <Typography variant="body1" gutterBottom>
                {recordingsEmptyText}
              </Typography>
              <NextLink href="/player/dashboard" passHref legacyBehavior>
                <Button
                  variant="outlined"
                  color="primary"
                  component="a"
                  sx={{ mt: 2 }}
                  size="large"
                >
                  Go to Dashboard
                </Button>
              </NextLink>
            </Box>
          </Box>
        </Paper>
      ) : (
        <RecordingList recordings={recordings} games={games} />
      )}
    </DashboardLayout>
  )
}

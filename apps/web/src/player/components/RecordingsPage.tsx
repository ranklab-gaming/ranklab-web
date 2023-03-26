import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Iconify } from "@/components/Iconify"
import { RecordingList } from "@/components/RecordingList"
import { Box, Button, Paper, Typography } from "@mui/material"
import { Game, Recording } from "@ranklab/api"
import NextLink from "next/link"

interface Props {
  recordings: Recording[]
  games: Game[]
}

export function PlayerRecordingsPage({
  recordings,
  games,
  user,
}: PropsWithUser<Props>) {
  return (
    <DashboardLayout user={user} title="Recordings">
      {recordings.length === 0 ? (
        <Paper>
          <Box p={2}>
            <Box textAlign="center" p={8}>
              <Iconify icon="eva:video-outline" width={40} height={40} />
              <Typography variant="h3" component="h1" gutterBottom>
                No Recordings Yet
              </Typography>
              <Typography variant="body1" gutterBottom>
                Once you upload a recording of your games, it will appear here.
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

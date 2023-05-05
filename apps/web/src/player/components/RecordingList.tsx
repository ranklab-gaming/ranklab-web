import { formatDate } from "@/helpers/formatDate"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material"
import { Game, Recording, RecordingState } from "@ranklab/api"
import { useState } from "react"
import { assertFind } from "@/assert"
import { useCreateReview } from "@/player/hooks/useCreateReview"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  recordings: Recording[]
  games: Game[]
}

export const RecordingList = ({ recordings, games }: Props) => {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  )

  const createReview = useCreateReview()
  const Recording = useGameDependency("component:recording")
  const recordingsDateColumn = useGameDependency("text:recordings-date-column")
  const recordingTitle = useGameDependency("text:recording-title")

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell width={300}>Title</TableCell>
          <TableCell align="center">Game</TableCell>
          <TableCell align="center">Skill Level</TableCell>
          <TableCell align="center">{recordingsDateColumn}</TableCell>
          <TableCell align="right" width={300}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {recordings.map((recording) => {
          const game = assertFind(games, (g) => g.id === recording.gameId)

          const skillLevel = assertFind(
            game.skillLevels,
            (sl) => sl.value === recording.skillLevel
          )

          return (
            <TableRow key={recording.id}>
              <TableCell width={300}>{recording.title}</TableCell>
              <TableCell align="center">{game.name}</TableCell>
              <TableCell align="center">{skillLevel.name}</TableCell>
              <TableCell align="center">
                {formatDate(recording.createdAt)}
              </TableCell>
              <TableCell align="right" width={300}>
                <Stack direction="row" spacing={1} justifyContent="end">
                  {recording.state === RecordingState.Processed ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => setSelectedRecording(recording)}
                    >
                      View {recordingTitle}
                    </Button>
                  ) : (
                    <Tooltip
                      title={`This ${recordingTitle.toLowerCase()} is being processed`}
                    >
                      <Box>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          disabled
                        >
                          View {recordingTitle}
                        </Button>
                      </Box>
                    </Tooltip>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    component="a"
                    onClick={() => createReview({ recordingId: recording.id })}
                  >
                    Request a Review
                  </Button>
                  <Dialog
                    onClose={() => setSelectedRecording(null)}
                    open={Boolean(selectedRecording)}
                    fullWidth
                    maxWidth="lg"
                  >
                    {selectedRecording ? (
                      <>
                        <DialogTitle>{selectedRecording.title}</DialogTitle>
                        <DialogContent sx={{ mt: 2, height: 500, p: 0 }}>
                          <Recording recording={selectedRecording} />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setSelectedRecording(null)}
                            color="primary"
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </>
                    ) : null}
                  </Dialog>
                </Stack>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

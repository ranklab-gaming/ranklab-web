import { uploadsCdnUrl } from "@/config"
import { formatDate } from "@/utils/formatDate"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { Game, Recording } from "@ranklab/api"
import { useState } from "react"

interface Props {
  recordings: Recording[]
  games: Game[]
}

export function RecordingList({ recordings, games }: Props) {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  )

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Game</TableCell>
            <TableCell>Skill Level</TableCell>
            <TableCell>Date Uploaded</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recordings.map((recording) => {
            const game = games.find((g) => g.id === recording.gameId)

            if (!game) {
              throw new Error("recording is missing game")
            }

            const skillLevel = game.skillLevels.find(
              (s) => s.value === recording.skillLevel
            )

            if (!skillLevel) {
              throw new Error("recording is missing skill level")
            }

            return (
              <TableRow key={recording.id}>
                <TableCell>{recording.title}</TableCell>
                <TableCell>{game.name}</TableCell>
                <TableCell>{skillLevel.name}</TableCell>
                <TableCell>{formatDate(recording.createdAt)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      href={`/api/new-review?recording_id=${recording.id}`}
                    >
                      Request a Review
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => setSelectedRecording(recording)}
                    >
                      View
                    </Button>
                    <Dialog
                      onClose={() => setSelectedRecording(null)}
                      open={Boolean(selectedRecording)}
                      fullWidth
                      maxWidth="lg"
                    >
                      {selectedRecording && (
                        <>
                          <DialogTitle>{selectedRecording.title}</DialogTitle>
                          <DialogContent sx={{ mt: 2 }}>
                            <video
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                maxHeight: 600,
                              }}
                              controls
                            >
                              <source
                                src={`${uploadsCdnUrl}/${selectedRecording.videoKey}`}
                                type={selectedRecording.mimeType}
                              />
                            </video>
                          </DialogContent>
                        </>
                      )}
                    </Dialog>
                  </Stack>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

import { uploadsCdnUrl } from "@/config"
import { formatDate } from "@/helpers/formatDate"
import {
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
import NextLink from "next/link"
import { assertFind } from "@/assert"

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
            <TableCell width={300}>Title</TableCell>
            <TableCell align="center">Game</TableCell>
            <TableCell align="center">Skill Level</TableCell>
            <TableCell align="center">Date Uploaded</TableCell>
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
                    <NextLink
                      href={`/api/new-review?recording_id=${recording.id}`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        component="a"
                      >
                        Request a Review
                      </Button>
                    </NextLink>
                    <Button
                      variant="outlined"
                      color="info"
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

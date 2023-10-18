import { api } from "@/api"
import { formatDate } from "@/helpers/formatDate"
import {
  Card,
  CardActionArea,
  CardContent,
  List,
  ListItem,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material"
import { Game, PaginatedResultForRecording } from "@ranklab/api"
import { MouseEvent, useEffect, useState } from "react"
import NextLink from "next/link"
import { Chip } from "@mui/material"
import { assertFind, assertProp } from "@/assert"
import pluralize from "pluralize"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
  queryParams?: {
    onlyOwn: boolean
  }
}

export const RecordingList = ({
  recordings: initialRecordings,
  games,
  queryParams,
}: Props) => {
  const [page, setPage] = useState(initialRecordings.page)
  const [recordings, setRecordings] = useState(initialRecordings)

  const onPageChange = async (
    _event: MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    const requestParams = { page: page + 1, ...(queryParams ?? {}) }
    const result = await api.recordingsList(requestParams)

    setPage(result.page)
    setRecordings(result)
  }

  useEffect(() => {
    setRecordings(initialRecordings)
  }, [initialRecordings])

  return (
    <>
      <List>
        {recordings.records.map((recording) => {
          const game = assertFind(games, (g) => g.id === recording.gameId)
          const recordingUser = assertProp(recording, "user")

          const skillLevel = assertFind(
            game.skillLevels,
            (sl) => sl.value === recording.skillLevel,
          )

          return (
            <ListItem key={recording.id} sx={{ p: 0, m: 0, mb: 2 }}>
              <Card sx={{ width: "100%" }}>
                <NextLink
                  href={`/recordings/${recording.id}`}
                  passHref
                  legacyBehavior
                >
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack spacing={2} flexGrow={1}>
                          <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                          >
                            <Typography variant="h6">
                              {recording.title}
                            </Typography>
                            <Chip label={skillLevel.name} size="small" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Submitted on {formatDate(recording.createdAt)} by{" "}
                            <Typography
                              component="span"
                              fontWeight="bold"
                              variant="body2"
                            >
                              {recordingUser.name}
                            </Typography>
                          </Typography>
                        </Stack>
                        <Chip
                          label={
                            recording.commentCount === 0
                              ? "Awaiting Feedback"
                              : pluralize(
                                  "Comment",
                                  recording.commentCount,
                                  true,
                                )
                          }
                          color={
                            recording.commentCount === 0
                              ? "primary"
                              : "secondary"
                          }
                          sx={{ fontWeight: "bold" }}
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
              </Card>
            </ListItem>
          )
        })}
      </List>
      {recordings.totalPages > 1 && (
        <TablePagination
          component="div"
          rowsPerPage={recordings.perPage}
          rowsPerPageOptions={[]}
          count={recordings.count}
          page={page - 1}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

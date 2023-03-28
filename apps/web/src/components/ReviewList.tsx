import { api } from "@/api"
import { GameIcon } from "./GameIcon"
import { useUser } from "@/hooks/useUser"
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
import { Game, PaginatedResultForReview } from "@ranklab/api"
import { MouseEvent, useState } from "react"
import NextLink from "next/link"
import { Chip } from "@mui/material"
import { ReviewState } from "./ReviewState"
import { assertFind, assertProp } from "@/assert"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
  queryParams?: {
    archived: boolean
  }
}

export const ReviewList = ({
  reviews: initialReviews,
  games,
  queryParams,
}: Props) => {
  const [page, setPage] = useState(initialReviews.page)
  const [reviews, setReviews] = useState(initialReviews)
  const user = useUser()

  const onPageChange = async (
    _event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    const requestParams = { page: page + 1, ...(queryParams ?? {}) }

    const result = await (user.type === "player"
      ? api.playerReviewsList(requestParams)
      : api.coachReviewsList(requestParams))

    setPage(result.page)
    setReviews(result)
  }

  return (
    <>
      <List>
        {reviews.records.map((review) => {
          const recording = assertProp(review, "recording")
          const game = assertFind(games, (g) => g.id === recording.gameId)
          const reviewUser =
            user.type === "player"
              ? assertProp(review, "coach")
              : assertProp(review, "player")

          const skillLevel = assertFind(
            game.skillLevels,
            (sl) => sl.value === recording.skillLevel
          )

          return (
            <ListItem key={review.id} sx={{ p: 0, m: 0, mb: 2 }}>
              <Card sx={{ width: "100%" }}>
                <NextLink
                  href={`/${user.type}/reviews/${review.id}`}
                  passHref
                  legacyBehavior
                >
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <GameIcon game={game} />
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
                            {user.type === "player"
                              ? `Review by ${reviewUser.name}`
                              : `Review for ${reviewUser.name}`}{" "}
                            requested on {formatDate(review.createdAt)}
                          </Typography>
                        </Stack>
                        <ReviewState state={review.state} size="small" />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
              </Card>
            </ListItem>
          )
        })}
      </List>
      {reviews.totalPages > 1 && (
        <TablePagination
          component="div"
          rowsPerPage={reviews.perPage}
          rowsPerPageOptions={[]}
          count={reviews.count}
          page={page - 1}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

import { api } from "@/api"
import { GameIcon } from "@/components/GameIcon"
import { Label } from "@/components/Label"
import { useUser } from "@/hooks/useUser"
import { formatDate } from "@/utils/formatDate"
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
import {
  Game,
  PaginatedResultForReview,
  Review,
  ReviewState,
} from "@ranklab/api"
import { MouseEvent, useState } from "react"
import NextLink from "next/link"
import { Chip } from "@mui/material"

const Status = function ({ reviewState }: { reviewState: Review["state"] }) {
  const color = (() => {
    switch (reviewState) {
      case ReviewState.AwaitingPayment:
        return "warning"
      case ReviewState.AwaitingReview:
        return "info"
      case ReviewState.Draft:
        return "info"
      case ReviewState.Published:
        return "success"
      case ReviewState.Accepted:
        return "success"
      case ReviewState.Refunded:
        return "error"
    }
  })()

  const label = (() => {
    switch (reviewState) {
      case ReviewState.AwaitingPayment:
        return "Awaiting Payment"
      case ReviewState.AwaitingReview:
        return "In Queue for Review"
      case ReviewState.Draft:
        return "Under Review"
      case ReviewState.Published:
        return "Reviewed"
      case ReviewState.Accepted:
        return "Accepted"
      case ReviewState.Refunded:
        return "Refunded"
    }
  })()

  return (
    <Label
      variant="filled"
      color={color}
      sx={{ textTransform: "capitalize", mx: "auto" }}
    >
      {label}
    </Label>
  )
}

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
  queryParams?: {
    archived: boolean
  }
}

export function ReviewList({
  reviews: initialReviews,
  games,
  queryParams,
}: Props) {
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
          const { recording, coach } = review

          if (!recording) {
            throw new Error("review is missing recording")
          }

          if (!coach) {
            throw new Error("review is missing coach")
          }

          const game = games.find((g) => g.id === recording.gameId)

          if (!game) {
            throw new Error("review is missing game")
          }

          const skillLevel = game.skillLevels.find(
            (s) => s.value === recording.skillLevel
          )

          if (!skillLevel) {
            throw new Error("review is missing skill level")
          }

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
                            Review by {coach.name} requested on{" "}
                            {formatDate(review.createdAt)}
                          </Typography>
                        </Stack>
                        <Status reviewState={review.state} />
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

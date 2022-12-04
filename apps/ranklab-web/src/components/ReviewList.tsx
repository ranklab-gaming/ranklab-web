// material
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TablePagination,
} from "@mui/material"
import { Game, Review, ReviewState } from "@ranklab/api"
import React, { FunctionComponent, useState, MouseEvent } from "react"
import Label from "./Label"
import NextLink from "next/link"
import { Pagination } from "../@types"
import api from "@ranklab/web/api/client"
import useSession from "../hooks/useSession"

const Status: FunctionComponent<{ reviewState: Review["state"] }> = function ({
  reviewState,
}) {
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
  reviews: Review[]
  games: Game[]
  pagination: Pagination
  queryParams?: {
    archived: boolean
  }
}

const ReviewList: FunctionComponent<Props> = function ({
  reviews: initialReviews,
  games,
  pagination,
  queryParams,
}) {
  const [page, setPage] = useState(pagination.page)
  const [reviews, setReviews] = useState(initialReviews)
  const session = useSession()

  const onPageChange = async (
    _event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    const requestParams = { page: page + 1, ...(queryParams || {}) }

    const result = await (session.user.type === "player"
      ? api.playerReviewsList(requestParams)
      : api.coachReviewsList(requestParams))

    setPage(result.page)
    setReviews(result.records)
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Game</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <NextLink
              href={`/${session.user.type.toLowerCase()}/reviews/${review.id}`}
              key={review.id}
            >
              <TableRow
                sx={{
                  cursor: "pointer",
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: (theme) =>
                    theme.transitions.create("background-color", {
                      duration: theme.transitions.duration.standard,
                    }),
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                <TableCell component="th" scope="row">
                  {review.title}
                </TableCell>
                <TableCell align="right">
                  {games.find((game) => game.id === review.gameId)!.name}
                </TableCell>
                <TableCell align="right">
                  <Status reviewState={review.state} />
                </TableCell>
              </TableRow>
            </NextLink>
          ))}
        </TableBody>
        {pagination.totalPages > 1 && (
          <TablePagination
            rowsPerPage={pagination.perPage}
            rowsPerPageOptions={[]}
            count={pagination.count}
            page={page - 1}
            onPageChange={onPageChange}
          />
        )}
      </Table>
    </TableContainer>
  )
}

export default ReviewList

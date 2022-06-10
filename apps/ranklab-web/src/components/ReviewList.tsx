// material
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material"
import { Game, Review, ReviewState } from "@ranklab/api"
import React, { FunctionComponent } from "react"
import Label from "./Label"
import NextLink from "next/link"

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
}

const ReviewList: FunctionComponent<Props> = function ({ reviews, games }) {
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
            <NextLink href={`/reviews/${review.id}`} key={review.id}>
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
      </Table>
    </TableContainer>
  )
}

export default ReviewList

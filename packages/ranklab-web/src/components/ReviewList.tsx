// material
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material"
import { Review } from "@ranklab/api"
import React, { FunctionComponent } from "react"
import Label from "./Label"

const Status: FunctionComponent<{ underReview: boolean }> = function ({
  underReview,
}) {
  return (
    <Label
      variant="filled"
      color={
        (underReview && "warning") || (!underReview && "info") || "success"
      }
      sx={{ textTransform: "capitalize", mx: "auto" }}
    >
      {underReview ? "Under Review" : "In Queue for Review"}
    </Label>
  )
}

interface Props {
  reviews: Review[]
}

const ReviewList: FunctionComponent<Props> = function ({ reviews }) {
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
            <TableRow
              key={review.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {review.title}
              </TableCell>
              <TableCell align="right">{review.game}</TableCell>
              <TableCell align="right">
                <Status underReview={Boolean(review.coachId)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ReviewList

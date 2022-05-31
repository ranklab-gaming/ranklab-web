// material
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Recording } from "@ranklab/api"
import React, { FunctionComponent } from "react"
import { fDateTime } from "src/utils/formatTime"
import NextLink from "next/link"

interface Props {
  recordings: Recording[]
}

const EmptyReview = styled("span")(({ theme }) => ({
  fontStyle: "italic",
  color: theme.palette.text.secondary,
}))

const RecordingList: FunctionComponent<Props> = function ({ recordings }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Uploaded</TableCell>
            <TableCell>Review</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recordings.map((recording) => (
            <NextLink
              href={
                recording.reviewId
                  ? `/reviews/${recording.reviewId}`
                  : `/r/${recording.id}`
              }
              key={recording.id}
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
                  {fDateTime(recording.createdAt)}
                </TableCell>
                <TableCell>
                  {recording.reviewTitle ?? (
                    <EmptyReview>No review associated</EmptyReview>
                  )}
                </TableCell>
              </TableRow>
            </NextLink>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RecordingList

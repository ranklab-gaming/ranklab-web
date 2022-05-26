// material
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material"
import { Recording } from "@ranklab/api"
import React, { FunctionComponent } from "react"
import { fDateTime } from "src/utils/formatTime"

interface Props {
  recordings: Recording[]
}

const RecordingList: FunctionComponent<Props> = function ({ recordings }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recordings.map((recording) => (
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
              <TableCell>{recording.videoKey}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RecordingList

import React, { FunctionComponent, useState } from "react"
import { Review } from "@ranklab/api"
import ReactPlayer from "react-player"
import { Typography, Paper, Grid, Stack } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineOppositeContent,
} from "@mui/lab"

import HotelIcon from "@mui/icons-material/Hotel"
import RepeatIcon from "@mui/icons-material/Repeat"
import FastfoodIcon from "@mui/icons-material/Fastfood"
import LaptopMacIcon from "@mui/icons-material/LaptopMac"

import { DraftEditor } from "@ranklab/web/src/components/editor"

type TimelineType = {
  key: number
  title: string
  des: string
  time: string
  color?:
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "inherit"
    | "grey"
    | "secondary"
  icon: JSX.Element
}

interface Props {
  review: Review
}

const TIMELINES: TimelineType[] = [
  {
    key: 1,
    title: "Default",
    des: "Morbi mattis ullamcorper",
    time: "09:30 am",
    icon: <FastfoodIcon />,
  },
  {
    key: 2,
    title: "Primary",
    des: "Morbi mattis ullamcorper",
    time: "10:00 am",
    color: "primary",
    icon: <LaptopMacIcon />,
  },
  {
    key: 3,
    title: "Secondary",
    des: "Morbi mattis ullamcorper",
    time: "10:00 am",
    color: "secondary",
    icon: <LaptopMacIcon />,
  },
  {
    key: 4,
    title: "Info",
    des: "Morbi mattis ullamcorper",
    time: "10:30 am",
    color: "info",
    icon: <HotelIcon />,
  },
  {
    key: 5,
    title: "Success",
    des: "Morbi mattis ullamcorper",
    time: "11:00 am",
    color: "success",
    icon: <RepeatIcon />,
  },
  {
    key: 6,
    title: "Warning",
    des: "Morbi mattis ullamcorper",
    time: "11:30 am",
    color: "warning",
    icon: <FastfoodIcon />,
  },
  {
    key: 7,
    title: "Error",
    des: "Morbi mattis ullamcorper",
    time: "12:00 am",
    color: "error",
    icon: <FastfoodIcon />,
  },
  {
    key: 8,
    title: "Default",
    des: "Morbi mattis ullamcorper",
    time: "09:30 am",
    icon: <FastfoodIcon />,
  },
  {
    key: 9,
    title: "Primary",
    des: "Morbi mattis ullamcorper",
    time: "10:00 am",
    color: "primary",
    icon: <LaptopMacIcon />,
  },
  {
    key: 10,
    title: "Secondary",
    des: "Morbi mattis ullamcorper",
    time: "10:00 am",
    color: "secondary",
    icon: <LaptopMacIcon />,
  },
  {
    key: 11,
    title: "Info",
    des: "Morbi mattis ullamcorper",
    time: "10:30 am",
    color: "info",
    icon: <HotelIcon />,
  },
  {
    key: 12,
    title: "Success",
    des: "Morbi mattis ullamcorper",
    time: "11:00 am",
    color: "success",
    icon: <RepeatIcon />,
  },
  {
    key: 13,
    title: "Warning",
    des: "Morbi mattis ullamcorper",
    time: "11:30 am",
    color: "warning",
    icon: <FastfoodIcon />,
  },
  {
    key: 14,
    title: "Error",
    des: "Morbi mattis ullamcorper",
    time: "12:00 am",
    color: "error",
    icon: <FastfoodIcon />,
  },
]

const Wrapper: FunctionComponent<{}> = ({ children }) => {
  return <div>{children}</div>
}

const AnalyzeReviewForm: FunctionComponent<Props> = ({ review }) => {
  const [newComment, setNewComment] = useState("" as any)

  return (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ReactPlayer
              width="100%"
              controls={true}
              url={review.videoUrl}
              wrapper={Wrapper}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <DraftEditor
              editorState={newComment}
              onEditorStateChange={setNewComment}
              error={newComment.length > 0}
              simple={true}
            />
          </Grid>
        </Grid>

        <Timeline position="alternate">
          {TIMELINES.map((item) => (
            <TimelineItem key={item.key}>
              <TimelineOppositeContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.time}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={item.color}></TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "grey.50012",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.des}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Stack>
    </div>
  )
}

export default AnalyzeReviewForm

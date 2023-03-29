import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Comment, Game, Review } from "@ranklab/api"
import { Recording } from "./ReviewsShowPage/Recording"
import { CommentList } from "./ReviewsShowPage/CommentList"
import { useRef, useState } from "react"
import { VideoPlayerRef } from "@/components/VideoPlayer"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { Iconify } from "@/components/Iconify"
import * as yup from "yup"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

const colors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

const CommentFormSchema = yup.object().shape({
  body: yup.string().required().min(1),
  drawing: yup.string().defined(),
})

type Colors = (typeof colors)[number]

export type CommentFormValues = yup.InferType<typeof CommentFormSchema>

export const CoachReviewsShowPage = ({
  review: initialReview,
  user,
  comments: initialComments,
  games,
}: PropsWithUser<Props>) => {
  const [review, setReview] = useState(initialReview)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const player = assertProp(review, "player")
  const recording = assertProp(review, "recording")
  const [videoTimestamp, setVideoTimestamp] = useState(0)
  const videoRef = useRef<VideoPlayerRef>(null)
  const [selectedColor, setSelectedColor] = useState<Colors>("primary")
  const [editing, setEditing] = useState(false)

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(CommentFormSchema),
    defaultValues: {
      body: "",
      drawing: "",
    },
  })

  return (
    <DashboardLayout user={user} title={recording.title} showTitle={false}>
      <ReviewDetails
        editing={editing}
        review={review}
        games={games}
        title={`Review For ${player.name}`}
        recordingHeaderElement={
          <AnimatePresence>
            {editing ? (
              <Box
                component={m.div}
                key="toolbar"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animateFade().in}
                pl={1}
              >
                <SpeedDial
                  direction="right"
                  ariaLabel="Color"
                  FabProps={{
                    size: "small",
                    color: selectedColor,
                  }}
                  sx={{
                    "& .MuiSpeedDial-actions": {
                      pl: 5,
                    },
                  }}
                  icon={
                    <SpeedDialIcon
                      openIcon={
                        <Iconify
                          icon="eva:brush-outline"
                          height={24}
                          fontSize={24}
                        />
                      }
                      icon={
                        <Iconify
                          icon="eva:brush-outline"
                          height={24}
                          fontSize={24}
                        />
                      }
                      sx={{
                        "& .MuiSpeedDialIcon-openIcon": {
                          transform: "none",
                          transition: "none",
                        },
                        "& .MuiSpeedDialIcon-icon": {
                          transform: "none",
                          transition: "none",
                        },
                      }}
                    />
                  }
                >
                  {colors.map((color, index) => (
                    <SpeedDialAction
                      key={index}
                      sx={{
                        color: (theme) => theme.palette.common.white,
                        bgcolor: (theme) => theme.palette[color].main,
                        "&:hover": {
                          bgcolor: (theme) => theme.palette[color].dark,
                        },
                      }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </SpeedDial>
              </Box>
            ) : null}
          </AnimatePresence>
        }
        recordingElement={
          <Recording
            recording={recording}
            onTimeUpdate={setVideoTimestamp}
            videoRef={videoRef}
            form={form}
            editing={editing}
          />
        }
        commentListElement={
          <CommentList
            comments={comments}
            review={review}
            videoTimestamp={videoTimestamp}
            onCommentsChange={setComments}
            onReviewChange={setReview}
            form={form}
            editing={editing}
            onStartEditing={(comment?: Comment) => {
              setEditing(true)

              if (comment) {
                form.setValue("body", comment.body)
                form.setValue("drawing", comment.drawing)
                videoRef.current?.seekTo(comment.videoTimestamp)
              } else {
                videoRef.current?.pause()
              }
            }}
            onStopEditing={() => {
              form.reset()
              setEditing(false)
            }}
          />
        }
      />
    </DashboardLayout>
  )
}

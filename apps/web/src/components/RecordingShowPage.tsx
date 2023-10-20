import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "./DashboardLayout"
import { Game, Comment, Recording as ApiRecording } from "@ranklab/api"
import { assertFind, assertProp } from "@/assert"
import { formatDate } from "@/helpers/formatDate"
import {
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  useTheme,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { useRef, useState } from "react"
import Sticky from "react-stickynode"
import { CommentList } from "./RecordingShowPage/CommentList"
import { Recording } from "./RecordingShowPage/Recording"
import { useForm } from "@/hooks/useForm"
import { Color, ReviewProvider } from "@/contexts/ReviewContext"
import { yupResolver } from "@hookform/resolvers/yup"
import { api } from "@/api"
import * as yup from "yup"
import { AnimatePresence, m } from "framer-motion"
import { CommentForm } from "./RecordingShowPage/CommentForm"
import { DrawingRef } from "./RecordingShowPage/Drawing"
import { animateFade } from "@/animate/fade"
import { useController } from "react-hook-form"

interface Props {
  recording: ApiRecording
  games: Game[]
  comments: Comment[]
}

export const CommentFormSchema = yup.object().shape({
  body: yup.string().required(),
  metadata: yup.object().shape({
    video: yup.object().shape({
      drawing: yup.string().defined(),
      timestamp: yup.number().defined(),
    }),
  }),
})

export type CommentFormValues = yup.InferType<typeof CommentFormSchema>

export const RecordingShowPage = ({
  recording,
  games,
  comments: initialComments,
  user,
}: PropsWithOptionalUser<Props>) => {
  const form = useForm<CommentFormValues>({
    mode: "onChange",
    resolver: yupResolver(CommentFormSchema),
    defaultValues: {
      body: "",
      metadata: {
        video: {
          timestamp: 0,
          drawing: "",
        },
      },
    },
  })

  const metadataController = useController({
    name: "metadata",
    control: form.control,
  })

  const bodyController = useController({
    name: "body",
    control: form.control,
  })

  const [comments, setComments] = useState(initialComments)
  const [editing, setEditing] = useState(false)
  const [color, setColor] = useState<Color>("primary")
  const [playing, setPlaying] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const game = assertFind(games, (g) => g.id === recording.gameId)
  const recordingUser = assertProp(recording, "user")
  const theme = useTheme()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const drawingRef = useRef<DrawingRef>(null)

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel,
  )

  const selectComment = (comment: Comment | null) => {
    videoRef.current?.pause()
    setPlaying(false)

    if (comment) {
      metadataController.field.onChange(comment.metadata)
      bodyController.field.onChange(comment.body)

      if (videoRef.current) {
        videoRef.current.currentTime =
          comment.metadata.video.timestamp / 1000000
      }

      setEditing(user?.id === comment.userId)
    } else {
      setEditing(false)
    }

    setSelectedComment(comment)
  }

  const saveComment = async (values: CommentFormValues) => {
    let comment: Comment

    if (!selectedComment) {
      comment = await api.commentsCreate({
        createCommentRequest: {
          recordingId: recording.id,
          body: values.body,
          metadata: values.metadata,
        },
      })
    } else {
      comment = await api.commentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata,
        },
      })
    }

    enqueueSnackbar("Comment saved successfully.", {
      variant: "success",
    })

    setComments(
      selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments],
    )

    selectComment(null)
  }

  const deleteComment = async () => {
    if (!selectedComment) {
      return
    }

    await api.commentsDelete({
      id: selectedComment.id,
    })

    enqueueSnackbar("Comment deleted successfully.", {
      variant: "success",
    })

    selectComment(null)
    setComments(comments.filter((c) => c.id !== selectedComment.id))
  }

  const handleSetPlaying = (playing: boolean) => {
    setPlaying(playing)
    setEditing(false)
    setSelectedComment(null)

    if (playing) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }

  const handleSetEditing = (editing: boolean) => {
    if (editing) {
      form.reset({
        metadata: {
          video: {
            timestamp: Math.floor(videoRef.current?.currentTime ?? 0) * 1000000,
            drawing: "",
          },
        },
      })
    }

    setSelectedComment(null)
    setEditing(editing)
  }

  const submit = form.handleSubmit(saveComment)

  const review = {
    color,
    comments,
    deleteComment,
    editing,
    form,
    games,
    playing,
    recording,
    selectedComment,
    setColor,
    setEditing: handleSetEditing,
    setPlaying: handleSetPlaying,
    setSelectedComment: selectComment,
    saveComment: submit,
    metadataController,
  }

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
      games={games}
    >
      <ReviewProvider value={review}>
        <form onSubmit={submit}>
          <Paper
            sx={{
              mb: 1,
              backgroundColor: theme.palette.grey[900],
            }}
            elevation={1}
          >
            <Stack
              direction="row"
              p={2}
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Typography variant="h3" component="h1" paragraph mb={0}>
                {recording.title}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Submitted by{" "}
                  <Typography
                    fontWeight="bold"
                    component="span"
                    variant="body2"
                  >
                    {recordingUser.name}
                  </Typography>{" "}
                  on {formatDate(recording.createdAt)}
                </Typography>
                <Chip label={skillLevel.name} size="small" />
                <Chip label={game.name} size="small" />
              </Stack>
            </Stack>
            {recording.notesText ? (
              <Card
                variant="outlined"
                sx={{ bgcolor: "grey.900" }}
                elevation={0}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    <span
                      dangerouslySetInnerHTML={{ __html: recording.notes }}
                    />
                  </Typography>
                </CardContent>
              </Card>
            ) : null}
          </Paper>
          <Grid container spacing={1}>
            <Grid item md={8} xs={12} sx={{ transition: "all 0.3s ease" }}>
              <Sticky top={64}>
                <Box
                  sx={{
                    height: "70vh",
                    flexGrow: 1,
                    backgroundColor: theme.palette.common.black,
                  }}
                  display="flex"
                  flexDirection="column"
                >
                  <Recording videoRef={videoRef} drawingRef={drawingRef} />
                </Box>
              </Sticky>
            </Grid>
            <Grid item md={4} xs={12} minHeight="70vh" position="relative">
              <Stack direction="column" height="100%">
                <AnimatePresence presenceAffectsLayout mode="popLayout">
                  <m.div
                    variants={animateFade().in}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    key={editing ? "editing" : "not-editing"}
                    style={{ minHeight: "100%" }}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {editing ? (
                        <CommentForm drawingRef={drawingRef} />
                      ) : (
                        <CommentList />
                      )}
                    </Paper>
                  </m.div>
                </AnimatePresence>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </ReviewProvider>
    </DashboardLayout>
  )
}

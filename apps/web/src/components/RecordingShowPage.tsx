import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "./DashboardLayout"
import { Game, Comment, Recording as ApiRecording } from "@ranklab/api"
import { assertFind, assertProp } from "@/assert"
import { formatDate } from "@/helpers/formatDate"
import {
  Paper,
  Stack,
  Typography,
  Button,
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
import { Iconify } from "./Iconify"
import { CommentList } from "./RecordingShowPage/CommentList"
import { Recording } from "./RecordingShowPage/Recording"
import { useForm } from "@/hooks/useForm"
import { Color, ReviewProvider } from "@/contexts/ReviewContext"
import { yupResolver } from "@hookform/resolvers/yup"
import { api } from "@/api"
import * as yup from "yup"

interface Props {
  recording: ApiRecording
  games: Game[]
  comments: Comment[]
}

export const CommentFormSchema = yup
  .object()
  .shape({
    body: yup.string().defined(),
    metadata: yup.mixed().defined(),
  })
  .test("is-valid", (values) => {
    return (
      values.body.length > 0 ||
      (values.metadata as any).video.drawing.length > 0
    )
  })

export type CommentFormValues = yup.InferType<typeof CommentFormSchema>

export const RecordingShowPage = ({
  recording: initialRecording,
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

  const [comments, setComments] = useState(initialComments)
  const [editingDrawing, setEditingDrawing] = useState(false)
  const [color, setColor] = useState<Color>("primary")
  const [editingText, setEditingText] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(initialRecording)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const game = assertFind(games, (g) => g.id === recording.gameId)
  const recordingUser = assertProp(recording, "user")
  const theme = useTheme()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const editing = editingDrawing || editingText

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel,
  )

  const readOnly = Boolean(
    !user || (selectedComment && selectedComment.userId !== user.id),
  )

  const selectComment = (comment: Comment | null) => {
    if (comment) {
      form.setValue("metadata", comment.metadata, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      form.setValue("body", comment.body, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      const video = comment.metadata?.video

      setEditingText(Boolean(comment.body))
      setEditingDrawing(Boolean(video.drawing))
    } else {
      setEditingText(false)
      setEditingDrawing(false)
      form.reset()
    }

    setPlaying(false)
    setSelectedComment(comment)
  }

  const saveComment = async (values: CommentFormValues) => {
    let comment: Comment

    if (!selectedComment) {
      comment = await api.commentsCreate({
        createCommentRequest: {
          recordingId: recording.id,
          body: values.body,
          metadata: values.metadata as any,
        },
      })
    } else {
      comment = await api.commentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata as any,
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

    if (playing) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }

  const submit = form.handleSubmit(saveComment)

  const review = {
    color,
    comments,
    deleteComment,
    editingDrawing,
    editingText,
    form,
    games,
    playing,
    recording,
    selectedComment,
    setColor,
    setEditingDrawing,
    setEditingText,
    setPlaying: handleSetPlaying,
    setRecording,
    setSelectedComment: selectComment,
    saveComment: submit,
    readOnly,
    editing,
  }

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
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
                  </Typography>
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/recordings/${recording.id}`,
                    )

                    enqueueSnackbar("Copied share link to clipboard", {
                      variant: "success",
                    })
                  }}
                >
                  Share
                  <Iconify icon="eva:external-link-outline" ml={1} />
                </Button>
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
                <Paper
                  elevation={4}
                  sx={{
                    backgroundColor: theme.palette.common.black,
                    height: "70vh",
                  }}
                >
                  <Box display="flex" flexDirection="column" height="100%">
                    <Recording videoRef={videoRef} />
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      p={2}
                    >
                      <Typography variant="caption" mb={0}>
                        Submitted on {formatDate(recording.createdAt)}
                      </Typography>
                      <Chip label={skillLevel.name} size="small" />
                      <Chip label={game.name} size="small" />
                    </Stack>
                  </Box>
                </Paper>
              </Sticky>
            </Grid>
            <Grid item md={4} xs={12} minHeight="70vh">
              <CommentList />
            </Grid>
          </Grid>
        </form>
      </ReviewProvider>
    </DashboardLayout>
  )
}

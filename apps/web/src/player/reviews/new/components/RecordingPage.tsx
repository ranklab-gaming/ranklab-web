import { api } from "@/api"
import { playerFromUser, PropsWithUser } from "@/auth"
import { Stepper } from "./Stepper"
import { VideoFileSelect } from "@/player/components/VideoFileSelect"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { Recording } from "@ranklab/api"
import { useUpload } from "@/hooks/useUpload"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "@/components/DashboardLayout"
import NextLink from "next/link"
import { useSnackbar } from "notistack"
import { updateSessionReview } from "@/api"
import { assertProp } from "@/assert"
import { uploadsCdnUrl } from "@/config"
import { GuideDialog } from "./RecordingPage/GuideDialog"
import { formatBytes } from "@/player/helpers/formatBytes"

const newRecordingId = "NEW_RECORDING"

const FormSchema = yup.object().shape({
  recordingId: yup.string().required("Recording is required"),
  newRecordingTitle: yup.string().when("recordingId", {
    is: newRecordingId,
    then: () => yup.string().required("Title is required"),
  }),
  newRecordingVideo: yup.mixed().when("recordingId", {
    is: newRecordingId,
    then: () =>
      yup
        .mixed()
        .test(
          "required",
          "Video is required",
          (value) => value && value instanceof File && value.size > 0
        )
        .test(
          "fileSize",
          "Video file must be less than 4GiB",
          (value) => value && value instanceof File && value.size < 4294967296
        ),
  }),
})

interface FormValues {
  recordingId: string
  newRecordingTitle: string
  newRecordingVideo?: File
}

interface Props {
  recordings: Recording[]
  recordingId?: string
}

export const PlayerReviewsNewRecordingPage = ({
  recordings: initialRecordings,
  user,
  recordingId: initialRecordingId,
}: PropsWithUser<Props>) => {
  const router = useRouter()
  const [recordings, setRecordings] = useState<Recording[]>(initialRecordings)
  const player = playerFromUser(user)
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const [guideDialogOpen, setGuideDialogOpen] = useState(false)

  const defaultValues: FormValues = {
    recordingId: initialRecordingId ?? newRecordingId,
    newRecordingTitle: "",
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const recordingId = watch("recordingId")
  const newRecordingVideo = watch("newRecordingVideo")
  const newRecordingTitle = watch("newRecordingTitle")

  const selectedRecording =
    recordingId === newRecordingId
      ? null
      : recordings.find((r) => r.id === recordingId)

  const [upload, { progress: uploadProgress, uploading }] = useUpload()

  const goToNextStep = async function (values: FormValues) {
    if (values.recordingId === newRecordingId) {
      const newRecordingVideo = assertProp(values, "newRecordingVideo")

      const recording = await api.playerRecordingsCreate({
        createRecordingRequest: {
          mimeType: newRecordingVideo.type,
          size: newRecordingVideo.size,
          title: values.newRecordingTitle,
          skillLevel: player.skillLevel,
          gameId: player.gameId,
        },
      })

      if (!recording.uploadUrl) {
        throw new Error("uploadUrl is missing")
      }

      upload({
        onDone: () => {
          setRecordings([...recordings, recording])
          setValue("recordingId", recording.id)
          handleSubmit(goToNextStep)()
        },
        onError: () => {
          enqueueSnackbar(
            "An error occurred while uploading your video. Please try again.",
            {
              variant: "error",
            }
          )
        },
        file: newRecordingVideo,
        url: recording.uploadUrl,
        headers: {
          "X-Amz-Acl": "public-read",
        },
      })

      return
    }

    await updateSessionReview({
      recordingId: values.recordingId,
    })

    await router.push("/player/reviews/new/coach")
  }

  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Choose a Recording"
      showTitle={false}
    >
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Box p={3}>
              <Stepper activeStep={0} />
              <form onSubmit={handleSubmit(goToNextStep)}>
                <Stack spacing={3} mt={4}>
                  <Controller
                    name="recordingId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        select
                        label="Recording"
                        onChange={field.onChange}
                        value={field.value}
                        onBlur={field.onBlur}
                        error={Boolean(error)}
                        helperText={
                          error
                            ? error.message
                            : "The recording you want to be reviewed"
                        }
                      >
                        <MenuItem value={newRecordingId}>
                          Upload a new recording
                        </MenuItem>
                        {recordings.map((recording) => (
                          <MenuItem key={recording.id} value={recording.id}>
                            {recording.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  {recordingId === newRecordingId && (
                    <Stack spacing={3}>
                      <Controller
                        name="newRecordingVideo"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <VideoFileSelect
                            {...field}
                            onChange={(file) => {
                              if (!newRecordingTitle && file) {
                                setValue(
                                  "newRecordingTitle",
                                  file.name.split(".")[0],
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                )
                              }

                              field.onChange(file)
                            }}
                            error={Boolean(error)}
                            helperText={
                              error ? (
                                error.message
                              ) : (
                                <>
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                  >
                                    Not sure how to record your gameplay? Check
                                    out{" "}
                                    <Link
                                      color="secondary.main"
                                      fontWeight="bold"
                                      component="button"
                                      sx={{
                                        verticalAlign: "baseline",
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setGuideDialogOpen(true)
                                      }}
                                    >
                                      our guide
                                    </Link>
                                    .
                                  </Typography>
                                  <GuideDialog
                                    open={guideDialogOpen}
                                    onClose={() => setGuideDialogOpen(false)}
                                  />
                                </>
                              )
                            }
                          />
                        )}
                      />
                      <Controller
                        name="newRecordingTitle"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Title"
                            error={Boolean(error)}
                            helperText={
                              error
                                ? error.message
                                : "A title to help you remember this recording"
                            }
                          />
                        )}
                      />
                    </Stack>
                  )}
                  {uploading ? (
                    <Stack spacing={1} direction="row" alignItems="center">
                      <Box flexGrow={1}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          color="secondary"
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {`${uploadProgress}% (${formatBytes(
                            (newRecordingVideo?.size ?? 0) *
                              (uploadProgress / 100)
                          )} / ${formatBytes(newRecordingVideo?.size ?? 0)})`}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : null}
                </Stack>
                {selectedRecording ? (
                  <Paper
                    elevation={4}
                    sx={{
                      mt: 2,
                      backgroundColor: theme.palette.grey[900],
                    }}
                  >
                    <video
                      height="400"
                      width="100%"
                      controls
                      key={selectedRecording.id}
                    >
                      <source
                        src={`${uploadsCdnUrl}/${selectedRecording.videoKey}`}
                        type={selectedRecording.mimeType}
                      />
                    </video>
                  </Paper>
                ) : null}
                <Stack direction="row">
                  <NextLink href="/player/dashboard" passHref legacyBehavior>
                    <Button variant="text" component={Link} sx={{ mt: 3 }}>
                      Cancel
                    </Button>
                  </NextLink>
                  <Box sx={{ flexGrow: 1 }} />
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || uploading}
                    disabled={isSubmitting || uploading}
                    sx={{ mt: 3 }}
                  >
                    Continue
                  </LoadingButton>
                </Stack>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  )
}

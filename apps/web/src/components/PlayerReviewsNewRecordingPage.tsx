import { api } from "@/api"
import { playerFromUser, PropsWithUser } from "@/auth"
import { PlayerReviewsNewStepper } from "@/components/PlayerReviewsNewStepper"
import { VideoFileSelect } from "@/components/VideoFileSelect"
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
  Stack,
  TextField,
} from "@mui/material"
import { Recording } from "@ranklab/api"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "./DashboardLayout"
import NextLink from "next/link"
import { useSnackbar } from "notistack"

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
        ),
  }),
})

interface FormValues {
  recordingId: string
  newRecordingTitle: string
  newRecordingVideo?: File
}

const defaultValues: FormValues = {
  recordingId: newRecordingId,
  newRecordingTitle: "",
}

interface Props {
  recordings: Recording[]
  coachId: string
}

export function PlayerReviewsNewRecordingPage(props: PropsWithUser<Props>) {
  const router = useRouter()
  const { user, coachId } = props
  const [recordings, setRecordings] = useState<Recording[]>(props.recordings)
  const [newRecording, setNewRecording] = useState<Recording | null>(null)
  const player = playerFromUser(user)
  const { enqueueSnackbar } = useSnackbar()

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

  const [
    upload,
    {
      progress: uploadProgress,
      loading: uploading,
      done: uploadDone,
      error: uploadError,
    },
  ] = useUpload(async ({ files }) => {
    const file = files[0]

    if (!file) {
      throw new Error("file is missing")
    }

    if (!newRecording) {
      throw new Error("new recording is missing")
    }

    if (!newRecording.uploadUrl) {
      throw new Error("upload url is missing")
    }

    return {
      method: "PUT",
      url: newRecording.uploadUrl,
      body: file,
      headers: {
        "X-Amz-Acl": "public-read",
      },
    }
  })

  const goToNextStep = async function (values: FormValues) {
    if (values.recordingId === newRecordingId) {
      if (!values.newRecordingVideo) {
        throw new Error("new recording video is missing")
      }

      const recording = await api.playerRecordingsCreate({
        createRecordingRequest: {
          mimeType: values.newRecordingVideo.type,
          size: values.newRecordingVideo.size,
          title: values.newRecordingTitle,
          skillLevel: player.skillLevel,
          gameId: player.gameId,
        },
      })

      setNewRecording(recording)

      return
    }

    await router.push({
      pathname: "/player/reviews/new/details",
      query: {
        recording_id: values.recordingId,
        coach_id: coachId,
      },
    })
  }

  useEffect(() => {
    if (!uploadDone || !newRecording) {
      return
    }

    setRecordings([...recordings, newRecording])
    setValue("recordingId", newRecording.id)
    handleSubmit(goToNextStep)()
  }, [uploadDone])

  useEffect(() => {
    if (!newRecordingVideo || !newRecording) {
      return
    }

    upload({
      files: {
        ...[newRecordingVideo],
        item: () => newRecordingVideo,
      },
    })
  }, [newRecording])

  useEffect(() => {
    if (!uploadError) {
      return
    }

    enqueueSnackbar(
      "An error occurred while uploading your video. Please try again.",
      {
        variant: "error",
      }
    )
  }, [uploadError])

  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Select a Recording"
      showTitle={false}
    >
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Box p={3}>
              <PlayerReviewsNewStepper activeStep={1} />
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
                              error ? error.message : "The video file to upload"
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
                  {uploading && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress ?? 0}
                      color="info"
                    />
                  )}
                </Stack>
                <Stack direction="row">
                  <NextLink
                    href="/player/reviews/new/coach"
                    passHref
                    legacyBehavior
                  >
                    <Button variant="text" component={Link} sx={{ mt: 3 }}>
                      Go back
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
                    Next
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

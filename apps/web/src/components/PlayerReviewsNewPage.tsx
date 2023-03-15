import { api } from "@/api"
import { playerFromUser, PropsWithUser } from "@/auth"
import { CoachesSelect } from "@/components/CoachesSelect"
import { Editor } from "@/components/Editor"
import { VideoFileSelect } from "@/components/VideoFileSelect"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  FormHelperText,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { Coach, Recording } from "@ranklab/api"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "./DashboardLayout"

const newRecordingId = "NEW_RECORDING"

const FormSchema = yup.object().shape({
  coachId: yup.string().required("Coach is required"),
  recordingId: yup.string().required("Recording is required"),
  newRecording: yup
    .object()
    .shape({
      title: yup.string().when("recordingId", {
        is: newRecordingId,
        then: yup.string().required("Title is required") as any,
      }),
      video: yup.mixed().when("recordingId", {
        is: newRecordingId,
        then: yup
          .mixed()
          .test(
            "required",
            "Video is required",
            (value) => value && value instanceof File && value.size > 0
          ) as any,
      }),
    })
    .required("New recording is required"),
  notes: yup.string(),
})

interface FormValues {
  coachId: string
  recordingId: string
  newRecording: {
    title: string
    video?: File
  }
  notes?: string
}

const defaultValues: FormValues = {
  coachId: "",
  recordingId: newRecordingId,
  newRecording: {
    title: "",
  },
}

interface Props {
  recordings: Recording[]
  coaches: Coach[]
}

export function PlayerReviewsNewPage(props: PropsWithUser<Props>) {
  const router = useRouter()
  const { coaches, user } = props
  const [recordings, setRecordings] = useState<Recording[]>(props.recordings)
  const [newRecording, setNewRecording] = useState<Recording | null>(null)
  const player = playerFromUser(user)

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
    serverErrorMessage:
      "There was a problem submitting the request. Please try again later.",
  })

  const recordingId = watch("recordingId")
  const newRecordingVideo = watch("newRecording.video")
  const newRecordingTitle = watch("newRecording.title")

  const [
    upload,
    { progress: uploadProgress, loading: uploading, done: uploadDone },
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

  const createReview = async function (values: FormValues) {
    if (values.recordingId === newRecordingId) {
      if (!values.newRecording.video) {
        throw new Error("new recording video is missing")
      }

      const recording = await api.playerRecordingsCreate({
        createRecordingRequest: {
          mimeType: values.newRecording.video.type,
          size: values.newRecording.video.size,
          title: values.newRecording.title,
          skillLevel: player.skillLevel,
          gameId: player.gameId,
        },
      })

      setNewRecording(recording)

      return
    }

    const review = await api.playerReviewsCreate({
      createReviewRequest: {
        notes: values.notes ?? "",
        coachId: values.coachId,
        recordingId: values.recordingId,
      },
    })

    await router.push(`/player/reviews/[id]`, review.id)
  }

  useEffect(() => {
    if (!uploadDone || !newRecording) {
      return
    }

    setRecordings([...recordings, newRecording])
    setValue("recordingId", newRecording.id)
    handleSubmit(createReview)()
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

  return (
    <DashboardLayout user={user} title="Request a Review">
      <form onSubmit={handleSubmit(createReview)}>
        <Stack spacing={3} mt={4}>
          <Controller
            name="coachId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CoachesSelect
                onChange={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                error={Boolean(error)}
                coaches={coaches}
                helperText={
                  error
                    ? error.message
                    : "The coach you want to assign the review to"
                }
              />
            )}
          />
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
                name="newRecording.video"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <VideoFileSelect
                    {...field}
                    onChange={(file) => {
                      if (!newRecordingTitle && file) {
                        setValue(
                          "newRecording.title",
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
                name="newRecording.title"
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
          <Controller
            name="notes"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Box>
                  <Editor
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={Boolean(error)}
                  />
                  <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                    {error
                      ? error.message
                      : "Any notes you want to add for the coach"}
                  </FormHelperText>
                </Box>
              )
            }}
          />
          {uploading && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress ?? 0}
              color="info"
            />
          )}
        </Stack>
        <LoadingButton
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || uploading}
          disabled={isSubmitting || uploading}
          sx={{ mt: 3 }}
        >
          {recordingId === newRecordingId
            ? "Upload and Continue to Checkout"
            : "Continue to Checkout"}
        </LoadingButton>
      </form>
    </DashboardLayout>
  )
}

import { yupResolver } from "@hookform/resolvers/yup"
import { Button, LinearProgress, Paper, Stack, TextField } from "@mui/material"
import { Recording } from "@ranklab/api"
import { useForm } from "@/hooks/useForm"
import * as yup from "yup"
import { VideoFileSelect } from "@/components/VideoFileSelect"
import { api } from "@/api/client"
import { usePlayer } from "@/hooks/usePlayer"
import { Controller } from "react-hook-form"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { useEffect, useState } from "react"
import { LoadingButton } from "@mui/lab"

const FormSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  video: yup
    .mixed()
    .test(
      "required",
      "Video is required",
      (value) => value && value instanceof File && value.size > 0
    ),
})

interface FormValues {
  title: string
  video?: File
}

const defaultValues: FormValues = {
  title: "",
}

interface Props {
  onUploadDone: (recording: Recording) => void
}

export function RecordingForm({ onUploadDone }: Props) {
  const player = usePlayer()
  const [recording, setRecording] = useState<Recording | null>(null)

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
      "There was a problem uploading the recording. Please try again later.",
  })

  const title = watch("title")
  const video = watch("video")

  const [upload, { progress, loading, done }] = useUpload(async ({ files }) => {
    const file = files[0]

    if (!file || !recording?.uploadUrl) {
      throw new Error("file or upload url is missing")
    }

    return {
      method: "PUT",
      url: recording.uploadUrl,
      body: file,
      headers: {
        "X-Amz-Acl": "public-read",
      },
    }
  })

  const createRecording = async ({ video, title }: FormValues) => {
    if (!video) {
      throw new Error("video is missing")
    }

    const recording = await api.playerRecordingsCreate({
      createRecordingRequest: {
        mimeType: video.type,
        size: video.size,
        title,
        skillLevel: player.skillLevel,
        gameId: player.gameId,
      },
    })

    setRecording(recording)
  }

  useEffect(() => {
    if (!video || !recording) {
      return
    }

    upload({
      files: {
        ...[video],
        item: () => video,
      },
    })
  }, [recording])

  useEffect(() => {
    if (done && recording) {
      onUploadDone(recording)
    }
  }, [done])

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Controller
          name="video"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <VideoFileSelect
              {...field}
              onChange={(file) => {
                if (!title && file) {
                  setValue("title", file.name.split(".")[0], {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }

                field.onChange(file)
              }}
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />
        {video && (
          <Controller
            name="title"
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
        )}
        <LoadingButton
          color="info"
          size="large"
          type="button"
          variant="outlined"
          fullWidth
          loading={isSubmitting || loading}
          disabled={isSubmitting || loading}
          onClick={handleSubmit(createRecording)}
        >
          Upload VOD
        </LoadingButton>
        {loading && (
          <LinearProgress
            variant="determinate"
            value={progress ?? 0}
            color="info"
          />
        )}
      </Stack>
    </Paper>
  )
}

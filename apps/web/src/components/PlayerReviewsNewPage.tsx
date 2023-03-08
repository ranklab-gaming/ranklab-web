import { api } from "@/api/client"
import { PropsWithUser } from "@/auth/server"
import { CoachesSelect } from "@/components/CoachesSelect"
import { Editor } from "@/components/Editor"
import FileUpload from "@/components/FileUpload"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Box, FormHelperText, MenuItem, Stack, TextField } from "@mui/material"
import { Coach, Recording } from "@ranklab/api"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "./DashboardLayout"

const FormSchema = yup.object().shape({
  coachId: yup.string().required("Coach is required"),
  recordingId: yup.string().required("Recording is required"),
  notes: yup.string(),
})

type FormValues = yup.InferType<typeof FormSchema>

const defaultValues: FormValues = {
  coachId: "",
  recordingId: "UPLOAD_NEW_RECORDING",
}

interface Props {
  recordings: Recording[]
  coaches: Coach[]
}

export function PlayerReviewsNewPage({
  coaches,
  user,
  recordings,
}: PropsWithUser<Props>) {
  const router = useRouter()
  const [files, setFiles] = useState<FileList | null>(null)
  const [recording, setRecording] = useState<Recording | null>(null)

  const handleDropFile = useCallback((files: FileList | null) => {
    setFiles(files)
  }, [])

  let [upload, { progress, done, loading }] = useUpload(async ({ files }) => {
    const file = files[0]

    if (!file) {
      return
    }

    const recording = await api.playerRecordingsCreate({
      createRecordingRequest: { mimeType: file.type, size: file.size },
    })

    setRecording(recording)

    return {
      method: "PUT",
      url: recording.uploadUrl,
      body: file,
      headers: {
        "X-Amz-Acl": "public-read",
      },
    }
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem submitting the request. Please try again later.",
  })

  const createReview = async function (values: FormValues) {
    const review = await api.playerReviewsCreate({
      createReviewRequest: {
        notes: values.notes ?? "",
        coachId: values.coachId,
        recordingId: values.recordingId,
      },
    })

    if (review) {
      router.push(`/player/reviews/${review.id}`)
    }
  }

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
                <MenuItem value={defaultValues.recordingId}>
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
          <FileUpload
            file={files?.[0] ?? null}
            onDrop={(_, __, e) =>
              handleDropFile(
                "dataTransfer" in e ? e.dataTransfer?.files ?? null : null
              )
            }
          />
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
        </Stack>
        <LoadingButton
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          Go to Checkout
        </LoadingButton>
      </form>
    </DashboardLayout>
  )
}

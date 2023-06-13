import { MediaState, Recording } from "@ranklab/api"
import { api } from "@/api"
import { RecordingForm as BaseRecordingForm } from "@/player/components/RecordingForm"
import { VideoFileSelect } from "@/player/components/VideoFileSelect"
import { formatBytes } from "@/player/helpers/formatBytes"
import { Stack, LinearProgress, Typography, Link, Box } from "@mui/material"
import { useSnackbar } from "notistack"
import { PropsWithChildren, useState } from "react"
import {
  Controller,
  DeepPartial,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form"
import {
  RecordingFormSchema,
  RecordingFormValues,
  useRecordingForm,
} from "../hooks/useRecordingForm"
import { useUpload } from "../hooks/useUpload"
import { GuideDialog } from "./RecordingForm/GuideDialog"

export interface RecordingFormProps<TValues extends RecordingFormValues> {
  recordingId?: string
  recordings: Recording[]
  notes?: string
  onSubmit: (values: TValues, recordingId: string) => Promise<void>
  submitText?: string
  forReview?: boolean
  recordingForm?: UseFormReturn<TValues>
}

export const RecordingForm = <
  TValues extends RecordingFormValues,
  TSchema extends RecordingFormSchema
>({
  recordings,
  recordingId,
  notes,
  onSubmit,
  submitText = "Continue",
  forReview = true,
  children,
  recordingForm: recordingFormProp,
}: PropsWithChildren<RecordingFormProps<TValues>>) => {
  const [guideDialogOpen, setGuideDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [upload, { progress: uploadProgress, uploading }] = useUpload()

  const defaultRecordingForm = useRecordingForm<TValues, TSchema>({
    defaultValues: {
      recordingId,
      notes,
    } as DeepPartial<TValues>,
  })

  const recordingForm = recordingFormProp ?? defaultRecordingForm
  const { watch, control, setValue } = recordingForm

  const newRecordingTitle = watch(
    "newRecordingTitle" as Path<TValues>
  ) as string

  const newRecordingVideo = watch(
    "newRecordingVideo" as Path<TValues>
  ) as File | null

  const submit = async function (values: any, recording: Recording) {
    if (newRecordingVideo) {
      if (!recording.uploadUrl) {
        throw new Error("uploadUrl is missing")
      }

      const headers: Record<string, string> = {
        "x-amz-acl": "public-read",
      }

      if (recording.instanceId) {
        headers["x-amz-meta-instance-id"] = recording.instanceId
      }

      await upload({
        file: newRecordingVideo,
        url: recording.uploadUrl,
        headers,
      })

      const waitForRecordingUploaded = async (
        retries = 20
      ): Promise<boolean> => {
        const updatedRecording = await api.playerRecordingsGet({
          id: recording.id,
        })

        if (updatedRecording.state !== MediaState.Created) {
          return true
        }

        if (retries === 0) {
          return false
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        return waitForRecordingUploaded(retries - 1)
      }

      if (!(await waitForRecordingUploaded())) {
        enqueueSnackbar(
          `There was an error uploading your recording. Please try again later.`,
          {
            variant: "error",
          }
        )

        return
      }
    }

    await onSubmit(values, recording.id)
  }

  return (
    <BaseRecordingForm
      onSubmit={submit}
      recordingForm={recordingForm}
      recordings={recordings}
      submitText={submitText}
      forReview={forReview}
      footerElement={
        uploading ? (
          <Stack spacing={1} direction="row" alignItems="center" mt={2}>
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
                  (newRecordingVideo?.size ?? 0) * (uploadProgress / 100)
                )} / ${formatBytes(newRecordingVideo?.size ?? 0)})`}
              </Typography>
            </Box>
          </Stack>
        ) : null
      }
    >
      <Controller
        name={"newRecordingVideo" as Path<TValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <VideoFileSelect
            name={field.name}
            value={field.value as File | null}
            onBlur={field.onBlur}
            onChange={(file) => {
              if (!newRecordingTitle && file) {
                setValue(
                  "newRecordingTitle" as Path<TValues>,
                  file.name.split(".")[0] as PathValue<TValues, Path<TValues>>,
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
                  <Typography variant="caption" color="textSecondary">
                    Not sure how to record your gameplay? Check out{" "}
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
      {children}
    </BaseRecordingForm>
  )
}

export default RecordingForm

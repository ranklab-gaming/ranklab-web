import { Game, MediaState, Recording } from "@ranklab/api"
import { api } from "@/api"
import { RecordingForm as BaseRecordingForm } from "@/components/RecordingForm"
import { VideoFileSelect } from "@/components/VideoFileSelect"
import { formatBytes } from "@/helpers/formatBytes"
import {
  Stack,
  LinearProgress,
  Typography,
  Link,
  Box,
  Paper,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { PropsWithChildren, useState } from "react"
import { Controller, Path, PathValue, UseFormReturn } from "react-hook-form"
import {
  RecordingFormValues,
  useRecordingForm,
} from "../hooks/useRecordingForm"
import { useUpload } from "@/hooks/useUpload"
import { GuideDialog } from "./RecordingForm/GuideDialog"
import { useGameDependency } from "@/hooks/useGameDependency"

export interface RecordingFormProps<TValues extends RecordingFormValues> {
  games: Game[]
  recordingForm?: UseFormReturn<TValues>
  onSubmit?: (values: TValues, recording: Recording) => Promise<void>
  headerElement?: JSX.Element
  showVideoField?: boolean
  requestMetadata?: (values: TValues) => any
}

export const RecordingForm = <TValues extends RecordingFormValues>({
  games,
  children,
  recordingForm: propsRecordingForm,
  onSubmit,
  headerElement,
  showVideoField = true,
  requestMetadata,
}: PropsWithChildren<RecordingFormProps<TValues>>) => {
  const [guideDialogOpen, setGuideDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [upload, { progress: uploadProgress, uploading }] = useUpload()
  const defaultRecordingForm = useRecordingForm<TValues>()
  const recordingForm = propsRecordingForm ?? defaultRecordingForm
  const { watch, control, setValue } = recordingForm
  const title = watch("title" as Path<TValues>) as string
  const video = watch("video" as Path<TValues>) as File | undefined
  const [previewURL, setPreviewURL] = useState<string | undefined>(undefined)
  const recordingSingular = useGameDependency("text:recording-singular")

  const submit = async function (values: any, recording: Recording) {
    if (video) {
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
        file: video,
        url: recording.uploadUrl,
        headers,
      })

      const waitForRecordingUploaded = async (
        retries = 20
      ): Promise<boolean> => {
        const updatedRecording = await api.recordingsGet({
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
          `There was an error submitting your ${recordingSingular}. Please try again later.`,
          {
            variant: "error",
          }
        )

        return
      }
    }

    await onSubmit?.(values, recording)
  }

  return (
    <BaseRecordingForm
      onSubmit={submit}
      games={games}
      recordingForm={recordingForm}
      requestMetadata={requestMetadata}
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
                  (video?.size ?? 0) * (uploadProgress / 100)
                )} / ${formatBytes(video?.size ?? 0)})`}
              </Typography>
            </Box>
          </Stack>
        ) : null
      }
    >
      {headerElement}
      {showVideoField ? (
        <>
          <Controller
            name={"video" as Path<TValues>}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <VideoFileSelect
                name={field.name}
                value={field.value as File | null}
                onBlur={field.onBlur}
                onChange={(file) => {
                  if (!title && file) {
                    setValue(
                      "title" as Path<TValues>,
                      file.name.split(".")[0] as PathValue<
                        TValues,
                        Path<TValues>
                      >,
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      }
                    )
                  }

                  field.onChange(file)

                  if (previewURL) {
                    URL.revokeObjectURL(previewURL)
                  }

                  if (file) {
                    setPreviewURL(URL.createObjectURL(file))
                  } else {
                    setPreviewURL(undefined)
                  }
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
          {previewURL ? (
            <Paper
              elevation={4}
              sx={{
                p: 2,
                bgcolor: "grey.800",
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <video src={previewURL} controls style={{ height: "100%" }} />
            </Paper>
          ) : null}
        </>
      ) : null}

      {children}
    </BaseRecordingForm>
  )
}

export default RecordingForm

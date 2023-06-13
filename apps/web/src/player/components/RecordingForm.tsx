import { CreateRecordingRequest, Recording } from "@ranklab/api"
import {
  RecordingFormValues,
  newRecordingId,
} from "@/player/hooks/useRecordingForm"
import { Controller, Path, UseFormReturn } from "react-hook-form"
import { usePlayer } from "@/player/hooks/usePlayer"
import { api } from "@/api"
import { Editor } from "@/components/Editor"
import { LoadingButton } from "@mui/lab"
import {
  Stack,
  TextField,
  MenuItem,
  FormHelperText,
  Button,
  Box,
  Link,
} from "@mui/material"
import NextLink from "next/link"
import { PropsWithChildren } from "react"
import { useGameDependency } from "@/hooks/useGameDependency"

export interface RecordingFormProps<TValues extends RecordingFormValues> {
  recordings: Recording[]
  onSubmit: (values: TValues, recording: Recording) => Promise<void>
  submitText?: string
  forReview?: boolean
  recordingForm: UseFormReturn<TValues>
  footerElement?: JSX.Element | null
}

export const RecordingForm = <TValues extends RecordingFormValues>({
  recordings,
  onSubmit,
  submitText = "Continue",
  forReview = true,
  recordingForm,
  children,
  footerElement,
}: PropsWithChildren<RecordingFormProps<TValues>>) => {
  const player = usePlayer()
  const newRecordingText = useGameDependency("text:new-recording")
  const RecordingListItem = useGameDependency("component:recording-list-item")
  const RecordingPreview = useGameDependency("component:recording-preview")

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = recordingForm

  const recordingId = watch("recordingId" as Path<TValues>)

  const selectedRecording =
    recordingId === newRecordingId
      ? null
      : recordings.find((r) => r.id === recordingId)

  const submit = async function (values: any) {
    let recording

    if (selectedRecording) {
      recording = selectedRecording
    } else {
      const request: CreateRecordingRequest = {
        title: values.newRecordingTitle,
        skillLevel: player.skillLevel,
        gameId: player.gameId,
        metadata: values.newRecordingMetadata,
      }

      recording = await api.playerRecordingsCreate({
        createRecordingRequest: request,
      })
    }

    onSubmit(values, recording)
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack spacing={3} mt={4}>
        {forReview ? (
          <Controller
            name={"recordingId" as Path<TValues>}
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
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
                  <MenuItem value={newRecordingId}>{newRecordingText}</MenuItem>
                  {recordings.map((recording) => (
                    <MenuItem key={recording.id} value={recording.id}>
                      <RecordingListItem
                        key={recording.id}
                        recording={recording}
                      />
                    </MenuItem>
                  ))}
                </TextField>
              )
            }}
          />
        ) : null}
        {recordingId === newRecordingId && (
          <Stack spacing={3}>
            {children}
            <Controller
              name={"newRecordingTitle" as Path<TValues>}
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
      </Stack>
      {selectedRecording ? (
        <RecordingPreview recording={selectedRecording} />
      ) : null}
      {forReview ? (
        <Controller
          name={"notes" as Path<TValues>}
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Box mt={2}>
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                />
                <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                  {error
                    ? error.message
                    : "Any notes you want to add for the coach (optional)"}
                </FormHelperText>
              </Box>
            )
          }}
        />
      ) : null}
      {footerElement}
      <Stack direction="row">
        {forReview ? (
          <NextLink href="/player/reviews/new/coach" passHref legacyBehavior>
            <Button variant="text" component={Link} sx={{ mt: 3 }}>
              Go Back
            </Button>
          </NextLink>
        ) : null}
        <Box sx={{ flexGrow: 1 }} />
        <LoadingButton
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {submitText}
        </LoadingButton>
      </Stack>
    </form>
  )
}

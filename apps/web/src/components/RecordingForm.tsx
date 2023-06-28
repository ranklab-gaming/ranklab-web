import { CreateRecordingRequest, Game, GameId, Recording } from "@ranklab/api"
import { RecordingFormValues } from "@/hooks/useRecordingForm"
import { Controller, Path, UseFormReturn } from "react-hook-form"
import { api } from "@/api"
import { Editor } from "@/components/Editor"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, FormHelperText, Box, MenuItem } from "@mui/material"
import { PropsWithChildren } from "react"
import { useGameDependency } from "@/hooks/useGameDependency"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/router"
import { assertFind } from "@/assert"
import { useSnackbar } from "notistack"

export interface RecordingFormProps<TValues extends RecordingFormValues> {
  games: Game[]
  onSubmit: (values: TValues, recording: Recording) => Promise<void>
  recordingForm: UseFormReturn<TValues>
  footerElement?: JSX.Element | null
}

export const RecordingForm = <TValues extends RecordingFormValues>({
  games,
  onSubmit,
  recordingForm,
  children,
  footerElement,
}: PropsWithChildren<RecordingFormProps<TValues>>) => {
  const user = useUser()
  const recordingSingular = useGameDependency("text:recording-singular")
  const createButtonText = useGameDependency("text:create-recording-button")
  const successMessage = useGameDependency("text:recording-created-success")
  const router = useRouter()
  const game = assertFind(games, (g) => g.id === user.gameId)
  const { enqueueSnackbar } = useSnackbar()

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = recordingForm

  const submit = async function (values: TValues) {
    const request: CreateRecordingRequest = {
      title: values.title,
      notes: values.notes,
      gameId: user.gameId as GameId,
      skillLevel: values.skillLevel,
      metadata: values.metadata,
    }

    const recording = await api.recordingsCreate({
      createRecordingRequest: request,
    })

    await onSubmit(values, recording)
    await router.push(`/recordings/${recording.id}`)
    enqueueSnackbar(successMessage, { variant: "success" })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack spacing={3} mt={4}>
        {children}
        <Controller
          name={"skillLevel" as Path<TValues>}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              select
              {...field}
              label="Skill Level"
              error={Boolean(error)}
              helperText={
                error
                  ? error.message
                  : `Your skill level in this ${recordingSingular}`
              }
            >
              {game.skillLevels.map((skillLevel) => (
                <MenuItem key={skillLevel.value} value={skillLevel.value}>
                  {skillLevel.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name={"title" as Path<TValues>}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Title"
              error={Boolean(error)}
              helperText={
                error
                  ? error.message
                  : `A title to help you remember this ${recordingSingular}`
              }
            />
          )}
        />
        <Controller
          name={"notes" as Path<TValues>}
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Box mt={2}>
                <Editor
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                />
                <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                  {error
                    ? error.message
                    : `Any notes you want to add for this ${recordingSingular} (optional)`}
                </FormHelperText>
              </Box>
            )
          }}
        />
      </Stack>
      {footerElement}
      <LoadingButton
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={isSubmitting}
        sx={{ mt: 3 }}
      >
        {createButtonText}
      </LoadingButton>
    </form>
  )
}

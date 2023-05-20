import { api } from "@/api"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { CreateRecordingRequest } from "@ranklab/api"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import NextLink from "next/link"
import { formatDate } from "@/helpers/formatDate"
import {
  RecordingFormProps,
  RecordingFormSchema,
  newRecordingId,
} from "@/games/video/components/RecordingForm"
import { ChessBoard } from "./ChessBoard"
import { Editor } from "@/components/Editor"
import { usePlayer } from "@/player/hooks/usePlayer"

interface FormValues {
  recordingId: string
  newRecordingTitle: string
  newRecordingMetadata?: any
  notes: string
}

const formSchema = RecordingFormSchema.shape({
  newRecordingMetadata: yup.object().when("recordingId", {
    is: newRecordingId,
    then: () => yup.object().required("PGN is required"),
  }),
})

const RecordingForm = ({
  recordings,
  recordingId: initialRecordingId,
  notes,
  onSubmit,
  submitText = "Continue",
  forReview = true,
}: RecordingFormProps) => {
  const player = usePlayer()
  const theme = useTheme()

  const defaultValues: FormValues = {
    recordingId: initialRecordingId ?? newRecordingId,
    newRecordingTitle: "",
    notes: notes ?? "",
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(formSchema),
    defaultValues,
  })

  const recordingId = watch("recordingId")
  const newRecordingMetadata = watch("newRecordingMetadata")

  const selectedRecording =
    recordingId === newRecordingId
      ? null
      : recordings.find((r) => r.id === recordingId)

  const submit = async function (values: FormValues) {
    let recordingId = values.recordingId

    if (values.recordingId === newRecordingId) {
      const request: CreateRecordingRequest = {
        title: values.newRecordingTitle,
        skillLevel: player.skillLevel,
        gameId: player.gameId,
        metadata: newRecordingMetadata,
      }

      const recording = await api.playerRecordingsCreate({
        createRecordingRequest: request,
      })

      recordingId = recording.id
    }

    onSubmit(values, recordingId)
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack spacing={3} mt={4}>
        {forReview ? (
          <Controller
            name="recordingId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                select
                label="Game"
                onChange={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                error={Boolean(error)}
                helperText={
                  error ? error.message : "The game you want to be reviewed"
                }
              >
                <MenuItem value={newRecordingId}>New game</MenuItem>
                {recordings.map((recording) => (
                  <MenuItem key={recording.id} value={recording.id}>
                    <Stack spacing={1}>
                      <Typography variant="body1">{recording.title}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Created on {formatDate(recording.createdAt)}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ) : null}
        {recordingId === newRecordingId ? (
          <>
            <Controller
              name="newRecordingMetadata"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  onChange={(event) => {
                    field.onChange({
                      ...newRecordingMetadata,
                      chess: {
                        ...newRecordingMetadata?.chess,
                        pgn: event.currentTarget.value,
                      },
                    })
                  }}
                  value={field.value?.chess?.pgn}
                  label="PGN"
                  error={Boolean(error)}
                  multiline
                  rows={4}
                  helperText={error ? error.message : "The game PGN file"}
                />
              )}
            />
            <Controller
              name="newRecordingMetadata"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl>
                  <InputLabel>Color</InputLabel>
                  <Select
                    {...field}
                    onChange={(event) => {
                      field.onChange({
                        ...newRecordingMetadata,
                        chess: {
                          ...newRecordingMetadata?.chess,
                          playerColor: event.target.value,
                        },
                      })
                    }}
                    value={field.value?.chess?.playerColor}
                    label="Color"
                    error={Boolean(error)}
                    defaultValue="white"
                  >
                    <MenuItem key="white" value="white">
                      White
                    </MenuItem>
                    <MenuItem key="black" value="black">
                      Black
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    {error
                      ? error.message
                      : "The color you played as in the game"}
                  </FormHelperText>
                </FormControl>
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
                      : "A title to help you remember this game"
                  }
                />
              )}
            />
          </>
        ) : null}
        {forReview ? (
          <Controller
            name="notes"
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
      </Stack>
      {selectedRecording ? (
        <Paper
          elevation={4}
          sx={{
            mt: 2,
            backgroundColor: theme.palette.grey[900],
          }}
        >
          <ChessBoard
            recording={selectedRecording}
            style={{ height: "300px" }}
          />
        </Paper>
      ) : null}
      <Stack direction="row">
        {forReview ? (
          <NextLink href="/player/dashboard" passHref legacyBehavior>
            <Button variant="text" component={Link} sx={{ mt: 3 }}>
              Cancel
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

export default RecordingForm

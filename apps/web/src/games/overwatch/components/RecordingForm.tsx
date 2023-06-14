import {
  newRecordingId,
  useRecordingForm,
} from "@/player/hooks/useRecordingForm"
import * as yup from "yup"
import {
  RecordingFormSchema as BaseRecordingFormSchema,
  RecordingFormValues as BaseRecordingFormValues,
} from "@/games/video/hooks/useRecordingForm"
import { RecordingForm as BaseRecordingForm } from "@/games/video/components/RecordingForm"
import { RecordingFormProps } from "@/games/video/components/RecordingForm"
import {
  TextField,
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material"
import { Controller } from "react-hook-form"

const RecordingFormSchema = BaseRecordingFormSchema.shape({
  newRecordingVideo: yup.mixed(),
  newRecordingMetadata: yup.mixed(),
}).test({
  name: "is-valid",
  test: function (value) {
    if (value.recordingId === newRecordingId) {
      if (value.newRecordingMetadata.overwatch.replayCode === "") {
        if (!value.newRecordingVideo) {
          return this.createError({
            message: "Video is required",
            path: "newRecordingVideo",
          })
        }
      } else {
        if (
          !["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(
            value.newRecordingMetadata.overwatch.playerPosition
          )
        ) {
          return this.createError({
            message: "Player position is required",
            path: "newRecordingMetadata.overwatch.playerPosition",
          })
        }
      }
    }

    return true
  },
})

interface RecordingFormValues extends BaseRecordingFormValues {
  newRecordingMetadata: {
    overwatch: {
      replayCode: string
      playerPosition: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
    }
  }
}

type RecordingFormSchema = yup.ObjectSchema<RecordingFormValues>

const RecordingForm = ({
  recordings,
  recordingId,
  notes,
  onSubmit,
  submitText = "Continue",
  forReview = true,
}: RecordingFormProps<RecordingFormValues>) => {
  const recordingForm = useRecordingForm<
    RecordingFormValues,
    RecordingFormSchema
  >({
    defaultValues: {
      recordingId,
      notes,
      newRecordingMetadata: {
        overwatch: {
          replayCode: "",
          playerPosition: "1",
        },
      },
    },
    formSchema: RecordingFormSchema as RecordingFormSchema,
  })

  const { watch, control } = recordingForm
  const newRecordingMetadata = watch("newRecordingMetadata")

  return (
    <BaseRecordingForm
      onSubmit={onSubmit}
      submitText={submitText}
      forReview={forReview}
      recordingForm={recordingForm}
      recordings={recordings}
    >
      <Controller
        name="newRecordingMetadata"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            onChange={(event) => {
              field.onChange({
                ...newRecordingMetadata,
                overwatch: {
                  ...newRecordingMetadata?.overwatch,
                  replayCode: event.target.value,
                },
              })
            }}
            value={field.value?.overwatch?.replayCode}
            label="Replay Code (optional)"
            error={Boolean(error)}
            helperText={error ? error.message : "The replay code (e.g. AB1C23)"}
          />
        )}
      />
      <Controller
        name="newRecordingMetadata"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Box borderRadius={1} border={1} borderColor="grey.700" p={2}>
            <FormControl error={Boolean(error)}>
              <FormLabel id="player-position-label">
                Player Position (optional)
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="player-position-label"
                name="playerPosition"
                value={field.value?.overwatch?.playerPosition}
                onChange={(event) => {
                  field.onChange({
                    ...newRecordingMetadata,
                    overwatch: {
                      ...newRecordingMetadata?.overwatch,
                      playerPosition: event.target.value,
                    },
                  })
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((position) => (
                  <FormControlLabel
                    key={position}
                    value={position.toString()}
                    control={<Radio />}
                    label={position.toString()}
                  />
                ))}
              </RadioGroup>
              {error ? <FormHelperText>{error.message}</FormHelperText> : null}
            </FormControl>
          </Box>
        )}
      />
    </BaseRecordingForm>
  )
}

export default RecordingForm

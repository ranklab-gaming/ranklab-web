import {
  newRecordingId,
  useRecordingForm,
} from "@/player/hooks/useRecordingForm"
import * as yup from "yup"
import { RecordingFormSchema as BaseRecordingFormSchema } from "@/player/hooks/useRecordingForm"
import { RecordingForm as BaseRecordingForm } from "@/player/components/RecordingForm"
import { RecordingFormProps } from "@/games/video/components/RecordingForm"
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  useTheme,
} from "@mui/material"
import { Controller } from "react-hook-form"

const RecordingFormSchema = BaseRecordingFormSchema.shape({
  newRecordingMetadata: yup.object().when("recordingId", {
    is: newRecordingId,
    then: () => yup.object().required("PGN is required"),
  }),
})

const RecordingForm = ({
  recordings,
  recordingId,
  notes,
  onSubmit,
  submitText = "Continue",
  forReview = true,
}: RecordingFormProps) => {
  const recordingForm = useRecordingForm({
    defaultValues: {
      recordingId,
      notes,
    },
    formSchema: RecordingFormSchema,
  })

  const { watch, control } = recordingForm
  const newRecordingMetadata = watch("newRecordingMetadata")

  return (
    <BaseRecordingForm
      onSubmit={(values, recording) => onSubmit(values, recording.id)}
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
              {error ? error.message : "The color you played as in the game"}
            </FormHelperText>
          </FormControl>
        )}
      />
    </BaseRecordingForm>
  )
}

export default RecordingForm

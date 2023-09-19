import { useRecordingForm } from "@/hooks/useRecordingForm"
import * as yup from "yup"
import { RecordingFormSchema as BaseRecordingFormSchema } from "@/hooks/useRecordingForm"
import {
  RecordingForm as BaseRecordingForm,
  RecordingFormProps as BaseRecordingFormProps,
} from "@/components/RecordingForm"
import {
  TextField,
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Box,
  Tabs,
  Tab,
  Stack,
} from "@mui/material"
import { Controller } from "react-hook-form"
import firstPosition from "@/images/overwatch/1.png"
import secondPosition from "@/images/overwatch/2.png"
import thirdPosition from "@/images/overwatch/3.png"
import fourthPosition from "@/images/overwatch/4.png"
import fifthPosition from "@/images/overwatch/5.png"
import sixthPosition from "@/images/overwatch/6.png"
import seventhPosition from "@/images/overwatch/7.png"
import eighthPosition from "@/images/overwatch/8.png"
import ninthPosition from "@/images/overwatch/9.png"
import tenthPosition from "@/images/overwatch/10.png"
import NextImage from "next/image"
import { useUser } from "@/hooks/useUser"

const positions = [
  firstPosition,
  secondPosition,
  thirdPosition,
  fourthPosition,
  fifthPosition,
  sixthPosition,
  seventhPosition,
  eighthPosition,
  ninthPosition,
  tenthPosition,
]

const RecordingFormSchema = BaseRecordingFormSchema.shape({
  useReplayCode: yup.boolean().defined(),
  video: yup
    .mixed({
      check(value): value is File {
        return value instanceof File
      },
    })
    .when("useReplayCode", {
      is: false,
      then: (s) =>
        s
          .test(
            "required",
            "Video is required",
            (value) => value && value instanceof File && value.size > 0,
          )
          .test(
            "fileSize",
            "Video file must be less than 4GiB",
            (value) =>
              value && value instanceof File && value.size < 4294967296,
          ),
    }),
  metadata: yup
    .object({
      overwatch: yup.object({
        replayCode: yup.string().defined(),
        playerPosition: yup.number().defined(),
      }),
    })
    .when("useReplayCode", {
      is: true,
      then: () =>
        yup.object({
          overwatch: yup.object({
            replayCode: yup
              .string()
              .defined()
              .length(6, "Replay code must be 6 characters")
              .required("Replay code is required"),
            playerPosition: yup
              .number()
              .defined()
              .min(0)
              .max(9)
              .required("Player position is required"),
          }),
        }),
    }),
})

type RecordingFormValues = yup.InferType<typeof RecordingFormSchema>
type RecordingFormSchema = yup.ObjectSchema<RecordingFormValues>

export const RecordingForm = ({
  games,
}: BaseRecordingFormProps<RecordingFormValues>) => {
  const user = useUser()

  const recordingForm = useRecordingForm<
    RecordingFormValues,
    RecordingFormSchema
  >({
    defaultValues: {
      useReplayCode: true,
      skillLevel: user.skillLevel,
      metadata: {
        overwatch: {
          replayCode: "",
          playerPosition: 0,
        },
      },
    },
    formSchema: RecordingFormSchema as RecordingFormSchema,
  })

  const { watch, control } = recordingForm
  const useReplayCode = watch("useReplayCode")

  return (
    <BaseRecordingForm
      games={games}
      recordingForm={recordingForm}
      showVideoField={!useReplayCode}
      requestMetadata={(values) => {
        if (values.useReplayCode) {
          return {
            overwatch: {
              replayCode: values.metadata.overwatch.replayCode,
              playerPosition: values.metadata.overwatch.playerPosition,
            },
          }
        }

        return {}
      }}
    >
      <Tabs
        value={useReplayCode ? 0 : 1}
        onChange={(_, value) => {
          recordingForm.setValue("useReplayCode", value === 0)
          recordingForm.clearErrors()
        }}
      >
        <Tab label="Replay Code" />
        <Tab label="Video File" />
      </Tabs>
      {useReplayCode ? (
        <>
          <Controller
            name="metadata.overwatch.replayCode"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Replay Code"
                error={Boolean(error)}
                helperText={
                  error ? error.message : "The replay code (e.g. AB1C23)"
                }
              />
            )}
          />
          <Controller
            name="metadata.overwatch.playerPosition"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box borderRadius={1} border={1} borderColor="grey.700" p={2}>
                <FormControl error={Boolean(error)}>
                  <FormLabel id="player-position-label">
                    Player Position
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="player-position-label"
                    {...field}
                  >
                    <Box display="flex" flexWrap="wrap" mt={2}>
                      {positions.map((position, index) => {
                        const positionValue = (index + 1).toString()

                        return (
                          <Stack direction="row" key={index}>
                            <FormControlLabel
                              value={index}
                              control={<Radio />}
                              label={
                                <NextImage
                                  src={position}
                                  width={70}
                                  height={45}
                                  alt={positionValue}
                                  style={{
                                    maxWidth: "none",
                                    width: "100%",
                                    height: "auto",
                                  }}
                                />
                              }
                            />
                          </Stack>
                        )
                      })}
                    </Box>
                  </RadioGroup>
                  {error ? (
                    <FormHelperText>{error.message}</FormHelperText>
                  ) : null}
                </FormControl>
              </Box>
            )}
          />
        </>
      ) : null}
    </BaseRecordingForm>
  )
}

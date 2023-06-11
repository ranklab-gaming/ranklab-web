import {
  RecordingFormSchema as BaseRecordingFormSchema,
  newRecordingId,
  useRecordingForm as baseUseRecordingForm,
  RecordingFormProps,
} from "@/player/hooks/useRecordingForm"
import * as yup from "yup"

export const RecordingFormSchema = BaseRecordingFormSchema.shape({
  newRecordingVideo: yup.mixed().when("recordingId", {
    is: newRecordingId,
    then: () =>
      yup
        .mixed()
        .test(
          "required",
          "Video is required",
          (value) => value && value instanceof File && value.size > 0
        )
        .test(
          "fileSize",
          "Video file must be less than 4GiB",
          (value) => value && value instanceof File && value.size < 4294967296
        ),
  }),
})

export function useRecordingForm({
  defaultValues = {},
  formSchema = RecordingFormSchema,
}: RecordingFormProps) {
  return baseUseRecordingForm({
    defaultValues,
    formSchema,
  })
}

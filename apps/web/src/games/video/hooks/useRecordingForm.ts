import {
  RecordingFormSchema as BaseRecordingFormSchema,
  RecordingFormValues as BaseRecordingFormValues,
  newRecordingId,
  useRecordingForm as baseUseRecordingForm,
  RecordingFormProps,
} from "@/player/hooks/useRecordingForm"
import { DeepPartial } from "react-hook-form"
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

export interface RecordingFormValues extends BaseRecordingFormValues {
  newRecordingVideo: File | null
}

export type RecordingFormSchema = yup.ObjectSchema<RecordingFormValues>

export function useRecordingForm<
  TValues extends RecordingFormValues = RecordingFormValues,
  TSchema extends RecordingFormSchema = RecordingFormSchema
>({
  defaultValues = {} as DeepPartial<TValues>,
  formSchema = RecordingFormSchema as TSchema,
}: RecordingFormProps<TValues, TSchema>) {
  return baseUseRecordingForm({
    defaultValues,
    formSchema,
  })
}

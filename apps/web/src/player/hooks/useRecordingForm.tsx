import { DeepPartial, useForm, UseFormReturn } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

export const newRecordingId = "NEW_RECORDING"

export const RecordingFormSchema = yup.object().shape({
  recordingId: yup.string().required("Recording is required"),
  newRecordingTitle: yup
    .string()
    .defined()
    .when("recordingId", {
      is: newRecordingId,
      then: () => yup.string().required("Title is required"),
    }),
  notes: yup.string().defined(),
})

export interface RecordingFormValues {
  recordingId: string
  newRecordingTitle: string
  notes: string
}

export type RecordingFormSchema = yup.ObjectSchema<RecordingFormValues>

export interface RecordingFormProps<
  TValues extends RecordingFormValues,
  TSchema extends RecordingFormSchema
> {
  defaultValues?: DeepPartial<TValues>
  formSchema?: TSchema
}

export function useRecordingForm<
  TValues extends RecordingFormValues = RecordingFormValues,
  TSchema extends RecordingFormSchema = RecordingFormSchema
>({
  defaultValues = {} as DeepPartial<TValues>,
  formSchema = RecordingFormSchema as TSchema,
}: RecordingFormProps<TValues, TSchema>): UseFormReturn<TValues> {
  const form = useForm<TValues>({
    defaultValues: {
      ...defaultValues,
      recordingId: defaultValues.recordingId ?? newRecordingId,
      notes: defaultValues.notes ?? "",
      newRecordingTitle: defaultValues.newRecordingTitle ?? "",
    },
    resolver: yupResolver(formSchema as any),
  })

  return form
}

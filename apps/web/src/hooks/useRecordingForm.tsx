import { DeepPartial, useForm, UseFormReturn } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

export const RecordingFormSchema = yup.object().shape({
  skillLevel: yup.number().required("Skill level is required"),
  title: yup.string().required("Title is required"),
  notes: yup.string().defined(),
  video: yup
    .mixed({
      check(value): value is File {
        return value instanceof File
      },
    })
    .test(
      "required",
      "Video is required",
      (value) => value && value instanceof File && value.size > 0,
    )
    .test(
      "fileSize",
      "Video file must be less than 4GiB",
      (value) => value && value instanceof File && value.size < 4294967296,
    ),
  metadata: yup
    .mixed({
      check(value): value is any {
        return true
      },
    })
    .defined(),
})

export type RecordingFormValues = yup.InferType<typeof RecordingFormSchema>
export type RecordingFormSchema = yup.ObjectSchema<RecordingFormValues>

export interface RecordingFormProps<
  TValues extends RecordingFormValues,
  TSchema extends RecordingFormSchema,
> {
  defaultValues?: DeepPartial<TValues>
  formSchema?: TSchema
}

export function useRecordingForm<
  TValues extends RecordingFormValues = RecordingFormValues,
  TSchema extends RecordingFormSchema = RecordingFormSchema,
>({
  defaultValues = {} as DeepPartial<TValues>,
  formSchema = RecordingFormSchema as TSchema,
}: RecordingFormProps<TValues, TSchema>): UseFormReturn<TValues> {
  const form = useForm<TValues>({
    defaultValues: {
      skillLevel: 0,
      title: "",
      notes: "",
      metadata: {},
      ...defaultValues,
    },
    resolver: yupResolver<TValues>(
      formSchema as unknown as yup.ObjectSchema<TValues>,
    ),
  })

  return form
}

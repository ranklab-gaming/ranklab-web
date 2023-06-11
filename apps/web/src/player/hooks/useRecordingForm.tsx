import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { UseFormReturn } from "react-hook-form"
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

export interface RecordingFormProps {
  defaultValues?: any
  formSchema?: yup.ObjectSchema<any>
}

export function useRecordingForm({
  defaultValues = {},
  formSchema = RecordingFormSchema,
}: RecordingFormProps): UseFormReturn<any> {
  const form = useForm({
    defaultValues: {
      ...defaultValues,
      recordingId: defaultValues.recordingId ?? newRecordingId,
      notes: defaultValues.notes ?? "",
      newRecordingTitle: defaultValues.newRecordingTitle ?? "",
    },
    resolver: yupResolver(formSchema),
  })

  return form
}

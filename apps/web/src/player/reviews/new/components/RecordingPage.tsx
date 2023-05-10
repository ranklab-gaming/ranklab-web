import { PropsWithUser } from "@/auth"
import { useGameDependency } from "@/hooks/useGameDependency"
import { Recording } from "@ranklab/api"
import * as yup from "yup"

const newRecordingId = "NEW_RECORDING"

interface Props {
  recordings: Recording[]
  recordingId?: string
  notes?: string
}

const RecordingFormSchema = yup.object().shape({
  recordingId: yup.string().required("Recording is required"),
  newRecordingTitle: yup.string().when("recordingId", {
    is: newRecordingId,
    then: () => yup.string().required("Title is required"),
  }),
})

export type RecordingFormSchema = typeof RecordingFormSchema
export type RecordingFormValues = yup.InferType<typeof RecordingFormSchema>

export const PlayerReviewsNewRecordingPage = ({
  recordings,
  user,
  recordingId,
  notes,
}: PropsWithUser<Props>) => {
  const RecordingForm = useGameDependency(
    "component:recording-form",
    user.gameId
  )

  return (
    <RecordingForm
      formSchema={RecordingFormSchema}
      newRecordingId={newRecordingId}
      recordingId={recordingId}
      recordings={recordings}
      user={user}
      notes={notes}
    />
  )
}

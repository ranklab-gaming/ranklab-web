import { PropsWithUser } from "@/auth/server"
import { DashboardLayout } from "./DashboardLayout"
import * as Yup from "yup"
import { api } from "@/api/client"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
} from "@mui/material"
import { Game, Recording, PaginatedResultForCoach } from "@ranklab/api"
import { useRouter } from "next/router"
import { Controller } from "react-hook-form"
import { useForm } from "@/hooks/useForm"
import { Editor } from "@/components/Editor"
import { CoachesSelect } from "@/components/CoachesSelect"

type FormValuesProps = {
  title: string
  gameId: string
  notes?: string
  coachId: string
  recordingId: string
}

const FormSchema: Yup.Schema<FormValuesProps> = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  gameId: Yup.string().required("Game is required"),
  coachId: Yup.string().required("Coach is required"),
  recordingId: Yup.string().required("Recording is required"),
  notes: Yup.string(),
})

const defaultValues = {
  title: "",
  gameId: "",
  coachId: "",
  recordingId: "",
}

interface Props {
  games: Game[]
  recordings: Recording[]
  coaches: PaginatedResultForCoach
}

export function PlayerNewReviewPage({
  games,
  recordings,
  coaches,
  user,
}: PropsWithUser<Props>) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem submitting the request. Please try again later.",
  })

  const selectedCoachId = watch("coachId")

  const selectedCoach = coaches.records.find(
    (coach) => coach.id === selectedCoachId
  )

  const createReview = async function (values: FormValuesProps) {
    const review = await api.playerReviewsCreate({
      createReviewRequest: {
        title: values.title,
        gameId: values.gameId,
        notes: values.notes ?? "",
        coachId: values.coachId,
        recordingId: values.recordingId,
      },
    })

    if (review) {
      router.push(`/player/reviews/${review.id}`)
    }
  }

  return (
    <DashboardLayout user={user} title="Request a Review">
      <form onSubmit={handleSubmit(createReview)}>
        <Stack spacing={3}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Title"
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="gameId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth>
                <InputLabel>Game</InputLabel>
                <Select
                  label="Game"
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                >
                  {games.map((game) => (
                    <MenuItem key={game.id} value={game.id}>
                      {game.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="coachId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth>
                <InputLabel>Coach</InputLabel>
                <CoachesSelect
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                  coaches={coaches.records}
                />
              </FormControl>
            )}
          />
          <div>
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary" }}
              gutterBottom
            >
              Notes
            </Typography>
            <Controller
              name="notes"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                />
              )}
            />
            {Boolean(errors.notes) && (
              <FormHelperText error sx={{ px: 2, textTransform: "capitalize" }}>
                {errors.notes?.message}
              </FormHelperText>
            )}
          </div>
        </Stack>
        <LoadingButton
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          Request a Review {selectedCoach ? `to ${selectedCoach.name}` : ""}
        </LoadingButton>
      </form>
    </DashboardLayout>
  )
}

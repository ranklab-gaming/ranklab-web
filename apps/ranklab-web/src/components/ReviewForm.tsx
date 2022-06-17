import * as Yup from "yup"
import {
  FormHelperText,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material"

import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import Editor from "@ranklab/web/src/components/editor"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/src/api"
import React, { FunctionComponent, useState } from "react"
import { Game, Recording } from "@ranklab/api"
import VideoPlayer from "./VideoPlayer"
import { useRouter } from "next/router"

export type FormValuesProps = {
  title: string
  gameId: string
  notes?: string
}

export const defaultValues = {
  title: "",
  gameId: "",
  notes: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  gameId: Yup.string().required("Game is required"),
  notes: Yup.string(),
})

interface Props {
  games: Game[]
  recording: Recording
}

const ReviewForm: FunctionComponent<Props> = ({ games, recording }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const review = await api.client.playerReviewsCreate({
        createReviewMutation: {
          gameId: data.gameId,
          title: data.title,
          notes: data.notes ?? "",
          recordingId: recording.id,
        },
      })

      router.push(`/reviews/${review.id}`)
    } catch (e: any) {
      if (e instanceof Response) {
        if (e.status !== 200) {
          setErrorMessage(
            "There was a problem submitting your recording. Please try again later."
          )
        }
      } else {
        throw e
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(errorMessage)}
        onClose={() => setErrorMessage("")}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Grid container direction="row" spacing={4}>
        <Grid item xs={12} md={6}>
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
                    <MenuItem value="">Select a Game</MenuItem>

                    {games.map((game) => (
                      <MenuItem key={game.id} value={game.id}>
                        {game.name}
                      </MenuItem>
                    ))}
                  </Select>
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
                    simple
                  />
                )}
              />
              {Boolean(errors.notes) && (
                <FormHelperText
                  error
                  sx={{ px: 2, textTransform: "capitalize" }}
                >
                  {errors.notes?.message}
                </FormHelperText>
              )}
            </div>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Grid container direction="column" spacing={2} sx={{ flex: "1" }}>
            <Grid sx={{ flexGrow: 1 }} item>
              <VideoPlayer
                src={`${process.env.NEXT_PUBLIC_UPLOADS_CDN_URL}/${recording.videoKey}`}
                type={recording.mimeType}
              />
            </Grid>
            <Grid item>
              <LoadingButton
                fullWidth
                color="info"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Form
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default ReviewForm

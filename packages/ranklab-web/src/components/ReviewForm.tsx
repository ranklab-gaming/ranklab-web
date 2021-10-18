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
} from "@mui/material"

import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import { DraftEditor } from "@ranklab/web/src/components/editor"
import { LoadingButton } from "@mui/lab"
import ReactPlayer from "react-player"
import api from "@ranklab/web/src/api"
import { useRouter } from "next/router"
import React, { FunctionComponent } from "react"
import { Game } from "@ranklab/api"

export type FormValuesProps = {
  title: string
  gameId: string
  description: any
}

export const defaultValues = {
  title: "",
  gameId: "",
  description: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  gameId: Yup.string().required("Game is required"),
  description: Yup.mixed().test(
    "max text",
    "Description must be at least 200 characters",
    (value) =>
      value && value.getCurrentContent().getPlainText("\u0001").length > 200
  ),
})

interface Props {
  games: Game[]
}

const ReviewForm: FunctionComponent<Props> = ({ games }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValuesProps>({
    mode: "onTouched",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const router = useRouter()

  const recordingId = Array.isArray(router.query.id)
    ? router.query.id.join(",")
    : router.query.id

  const onSubmit = async (data: FormValuesProps) => {
    await api.client.reviewsCreate({
      gameId: data.gameId,
      recordingId: recordingId!,
      title: data.title,
    })

    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                Description
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DraftEditor
                    editorState={field.value}
                    onEditorStateChange={field.onChange}
                    onBlur={field.onBlur}
                    error={Boolean(error)}
                    simple={true}
                  />
                )}
              />
              {Boolean(errors.description) && (
                <FormHelperText
                  error
                  sx={{ px: 2, textTransform: "capitalize" }}
                >
                  {errors.description?.message}
                </FormHelperText>
              )}
            </div>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Grid container direction="column" spacing={2} sx={{ flex: "1" }}>
            <Grid sx={{ flexGrow: 1 }} item>
              <ReactPlayer
                width="100%"
                controls={true}
                url={`https://ranklab-dev.s3.eu-west-2.amazonaws.com/${recordingId}`}
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
                disabled={!isDirty}
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

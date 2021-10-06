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
import api, { gameFromString } from "src/api"
import { useRouter } from "next/router"
import React from "react"

export type FormValuesProps = {
  title: string
  game: string
  description: any
}

export const defaultValues = {
  title: "",
  game: "",
  description: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  game: Yup.string().required("Game is required"),
  description: Yup.mixed().test(
    "max text",
    "Description must be at least 200 characters",
    (value) =>
      value && value.getCurrentContent().getPlainText("\u0001").length > 200
  ),
})

export default function ReviewForm() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValuesProps>({
    mode: "onTouched",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const router = useRouter()

  const onSubmit = async (data: FormValuesProps) => {
    const recordingId = Array.isArray(router.query.id)
      ? router.query.id.join(",")
      : router.query.id

    await api.client.reviewsCreate({
      game: gameFromString(data.game.toLowerCase()),
      recordingId: recordingId!,
      title: data.title,
    })

    reset()
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
              name="game"
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

                    {["Overwatch", "Dota"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
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
                url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
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

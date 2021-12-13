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

import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { Controller, useForm } from "react-hook-form"
import { DraftEditor } from "@ranklab/web/src/components/editor"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/src/api"
import { useRouter } from "next/router"
import React, { FunctionComponent, useState } from "react"
import { Game } from "@ranklab/api"
import { EditorState } from "draft-js"
import VideoPlayer from "./VideoPlayer"

export type FormValuesProps = {
  title: string
  gameId: string
  notes: string
}

export const defaultValues = {
  title: "",
  gameId: "",
  notes: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  gameId: Yup.string().required("Game is required"),
  notes: Yup.string().required(),
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [errorMessage, setErrorMessage] = useState("")

  const recordingId = Array.isArray(router.query.id)
    ? router.query.id.join(",")
    : router.query.id

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await api.client.reviewsCreate({
        createReviewRequest: {
          gameId: data.gameId,
          recordingId: recordingId!,
          title: data.title,
          notes: data.notes,
        },
      })

      router.push("/dashboard")
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
            {/* @ts-ignore */}
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

            {/* @ts-ignore */}
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
              {/* @ts-ignore */}
              <Controller
                name="notes"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DraftEditor
                    editorState={editorState}
                    onEditorStateChange={(editorState) => {
                      field.onChange(
                        editorState.getCurrentContent().getPlainText("\u0001")
                      )

                      setEditorState(editorState)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(error)}
                    simple={true}
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
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${recordingId}.mp4`}
                type=
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

import React from "react"
import * as Yup from "yup"
// material
import { styled } from "@mui/material/styles"
import {
  Card,
  Container,
  CardHeader,
  CardContent,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import Page from "src/components/Page"
import { DraftEditor } from "src/components/editor"
import { LoadingButton } from "@mui/lab"

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}))

// ----------------------------------------------------------------------

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

function Form() {
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

  const onSubmit = async (_data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                />
              )}
            />
            {Boolean(errors.description) && (
              <FormHelperText error sx={{ px: 2, textTransform: "capitalize" }}>
                {errors.description?.message}
              </FormHelperText>
            )}
          </div>

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
        </Stack>
      </form>
    </>
  )
}

export default function NewReplayForm() {
  return (
    <RootStyle title="New Replay">
      <Container sx={{ mt: 10 }}>
        <Card sx={{ position: "static" }}>
          <CardHeader title="New Replay" />
          <CardContent>
            <Form />
          </CardContent>
        </Card>
      </Container>
    </RootStyle>
  )
}

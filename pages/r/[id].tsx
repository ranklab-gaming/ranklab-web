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
  fullName: string
  email: string
  draftEditor: any
}

export const defaultValues = {
  fullName: "",
  email: "",
  draftEditor: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(6, "Mininum 6 characters")
    .max(15, "Maximum 15 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("That is not an email"),
  draftEditor: Yup.mixed().test(
    "max text",
    "Draft editor Must Be At Least 200 Characters",
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
            name="fullName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Full Name"
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email address"
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />

          <div>
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary" }}
              gutterBottom
            >
              Draft Editor
            </Typography>
            <Controller
              name="draftEditor"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DraftEditor
                  editorState={field.value}
                  onEditorStateChange={field.onChange}
                  error={Boolean(error)}
                />
              )}
            />
            {Boolean(errors.draftEditor) && (
              <FormHelperText error sx={{ px: 2, textTransform: "capitalize" }}>
                {errors.draftEditor?.message}
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

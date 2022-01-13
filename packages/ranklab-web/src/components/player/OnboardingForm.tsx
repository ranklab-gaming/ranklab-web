import { FunctionComponent, useState } from "react"
import * as Yup from "yup"
import api from "src/api"
import router from "next/router"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Snackbar, Stack, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"

export type FormValuesProps = {
  name: string
}

export const defaultValues = {
  name: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
})

const PlayerOnboardingForm: FunctionComponent<{}> = () => {
  const [errorMessage, setErrorMessage] = useState("")

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValuesProps>({
    mode: "onTouched",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await api.client.claimsPlayersCreate({
        createPlayerRequest: {
          name: data.name,
        },
      })

      router.push("/dashboard")
    } catch (e: any) {
      if (e instanceof Response) {
        if (e.status !== 200) {
          setErrorMessage(
            "There was a problem creating your profile. Please try again later."
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
      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />
        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          Create Profile
        </LoadingButton>
      </Stack>
    </form>
  )
}

export default PlayerOnboardingForm

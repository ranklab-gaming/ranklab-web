import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography, TextField, Box, styled } from "@mui/material"
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { FunctionComponent } from "react"
import { FormProvider, Controller } from "react-hook-form"
import * as yup from "yup"
import { BasicLayout } from "@/components/BasicLayout"
import { api } from "@/api/client"
import { useForm } from "@/hooks/useForm"
import { useRouter } from "next/router"
import { useParam } from "@/hooks/useParam"

type FormValuesProps = {
  email: string
}

const ResetPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
})

function PasswordRequestResetPage() {
  const defaultValues = { email: "" }
  const { enqueueSnackbar } = useSnackbar()

  const userType = useParam("user_type", "player", [
    "coach",
    "player",
  ]) as UserType

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem resetting your password. Please try again later.",
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValuesProps) => {
    await api.sessionResetPassword({
      resetPasswordRequest: { ...data, userType },
    })

    enqueueSnackbar("Check your email for a link to reset your password.", {
      variant: "success",
    })
  }

  return (
    <BasicLayout title="Reset Your Password">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ maxWidth: 480 }}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Email"
                  type="email"
                />
              )}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ maxWidth: 480, mt: 2 }}
          >
            Reset Password
          </LoadingButton>
        </form>
      </FormProvider>
    </BasicLayout>
  )
}

export default PasswordRequestResetPage

import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { BasicLayout } from "@/components/BasicLayout"
import { api } from "@/api/client"
import { authenticate } from "@/auth"
import { useForm } from "@/hooks/useForm"
import { useParam } from "@/hooks/useParam"

type FormValuesProps = {
  password: string
}

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
})

function PasswordResetPage() {
  const defaultValues = { password: "" }
  const { enqueueSnackbar } = useSnackbar()

  const userType = useParam("user_type", "player", [
    "coach",
    "player",
  ]) as UserType

  const token = useParam("token")

  if (!token) {
    throw new Error("token param is missing")
  }

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
    await api.sessionUpdatePassword({
      updatePasswordRequest: data,
      auth: { userType, token },
    })

    enqueueSnackbar("Your password was updated successfully.", {
      variant: "success",
    })

    await authenticate(userType)
  }

  return (
    <BasicLayout title="Reset Your Password">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ maxWidth: 480 }}>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Password"
                  type="password"
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
            Change Password
          </LoadingButton>
        </form>
      </FormProvider>
    </BasicLayout>
  )
}

export default PasswordResetPage

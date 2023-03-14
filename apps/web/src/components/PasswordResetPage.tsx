import { api } from "@/api"
import { BasicLayout } from "@/components/BasicLayout"
import { useForm } from "@/hooks/useForm"
import { useParam } from "@/hooks/useParam"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { UserType } from "@ranklab/api"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { Controller, FormProvider } from "react-hook-form"
import * as yup from "yup"

const FormSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
})

type FormValues = yup.InferType<typeof FormSchema>

function PasswordResetPage() {
  const defaultValues: FormValues = { password: "" }
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const userType = useParam("user_type", "player", [
    "coach",
    "player",
  ]) as UserType

  const token = useParam("token")

  if (!token) {
    throw new Error("token param is missing")
  }

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem resetting your password. Please try again later.",
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValues) => {
    await api.sessionUpdatePassword({
      updatePasswordRequest: data,
      auth: { userType, token },
    })

    enqueueSnackbar("Your password was updated successfully.", {
      variant: "success",
    })

    await router.push(`/api/auth/signin?user_type=${userType}`)
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
                  error={Boolean(error)}
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

import { api } from "@/api"
import { BasicLayout } from "./BasicLayout"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { Controller, FormProvider } from "react-hook-form"
import * as yup from "yup"
import { useRouter } from "next/router"

const FormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
})

type FormValues = yup.InferType<typeof FormSchema>

export const PasswordRequestResetPage = () => {
  const defaultValues: FormValues = { email: "" }
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const userType = router.query.user_type as UserType

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValues) => {
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
                  error={Boolean(error)}
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

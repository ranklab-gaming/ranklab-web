import { api } from "@/api"
import { BasicLayout } from "./BasicLayout"
import { useForm } from "@/hooks/useForm"
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

interface Props {
  token: string
}

export const PasswordResetPage = ({ token }: Props) => {
  const defaultValues: FormValues = { password: "" }
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const userType = router.query.user_type as UserType

  const form = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
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

    await router.push(`/${userType}/login`)
  }

  return (
    <BasicLayout title="Reset Your Password">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
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
            sx={{ mt: 2 }}
          >
            Change Password
          </LoadingButton>
        </form>
      </FormProvider>
    </BasicLayout>
  )
}

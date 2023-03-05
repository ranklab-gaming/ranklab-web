import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography, TextField, Box, styled } from "@mui/material"
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { FunctionComponent } from "react"
import { FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { BasicLayout } from "@/components/BasicLayout"
import { api } from "@/api/client"
import { getParam } from "@/server/utils"
import { GetServerSideProps } from "next"
import { authenticate } from "@/auth"
import { useForm } from "@/hooks/useForm"

type FormValuesProps = {
  password: string
}

const ContentStyle = styled("div")(() => ({
  maxWidth: "480px",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
}))

interface Props {
  userType: UserType
  token: string
}

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
})

export const getServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  let userType = getParam(ctx, "user_type")
  const token = getParam(ctx, "token")

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
  }

  if (!token) {
    throw new Error("token is missing")
  }

  return {
    props: {
      userType: userType as UserType,
      token,
    },
  }
}

const PasswordResetPage: FunctionComponent<Props> = function ({
  userType,
  token,
}) {
  const defaultValues = { password: "" }
  const { enqueueSnackbar } = useSnackbar()

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
      <ContentStyle>
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              Change your password
            </Typography>
          </Box>
        </Stack>
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
      </ContentStyle>
    </BasicLayout>
  )
}

export default PasswordResetPage

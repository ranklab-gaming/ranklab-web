import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography, TextField, Box, styled } from "@mui/material"
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { FunctionComponent } from "react"
import { FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { BasicLayout } from "@/components/BasicLayout"
import { getParam } from "@/server/utils"
import { GetServerSideProps } from "next"
import { api } from "@/api/client"
import { useForm } from "@/hooks/useForm"

type FormValuesProps = {
  email: string
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
}

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
})

export const getServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  let userType = getParam(ctx, "user_type")

  if (!["coach", "player"].includes(userType ?? "")) {
    userType = "player"
  }

  return {
    props: {
      userType: userType as UserType,
    },
  }
}

const PasswordRequestResetPage: FunctionComponent<Props> = function ({
  userType,
}) {
  const defaultValues = {
    email: "",
  }

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
    await api.sessionResetPassword({
      resetPasswordRequest: { ...data, userType },
    })

    enqueueSnackbar("Check your email for a link to reset your password.", {
      variant: "success",
    })
  }

  return (
    <BasicLayout title="Reset Your Password">
      <ContentStyle>
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              Reset your password
            </Typography>
          </Box>
        </Stack>

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
      </ContentStyle>
    </BasicLayout>
  )
}

export default PasswordRequestResetPage

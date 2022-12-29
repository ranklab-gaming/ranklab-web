import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Typography,
  TextField,
  Box,
  styled,
  Container,
} from "@mui/material"
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { FunctionComponent } from "react"
import { FormProvider, Controller, useForm } from "react-hook-form"
import * as Yup from "yup"
import MinimalLayout from "@ranklab/web/layouts/minimal"
import api from "../../api/client"
import { useRequiredParam } from "@ranklab/web/hooks/useParam"
import { GetServerSideProps } from "next"
import signIn from "@ranklab/web/utils/signIn"

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

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
})

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  const userType = useRequiredParam(ctx, "user_type")
  const token = useRequiredParam(ctx, "token")

  return {
    props: {
      userType,
      token,
    },
  }
}

const UpdatePassword: FunctionComponent<Props> = function ({
  userType,
  token,
}) {
  const defaultValues = {
    password: "",
  }

  const { enqueueSnackbar } = useSnackbar()

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(UpdatePasswordSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await api.sessionUpdatePassword({
        updatePasswordRequest: data,
        auth: { userType, token },
      })
    } catch (error) {
      enqueueSnackbar(
        "There was a problem resetting your password. Please try again later.",
        { variant: "error" }
      )
      return
    }

    enqueueSnackbar("Your password was updated successfully.", {
      variant: "success",
    })

    signIn(userType)
  }

  return (
    <MinimalLayout>
      <Container>
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Update your password
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
                Update Password
              </LoadingButton>
            </form>
          </FormProvider>
        </ContentStyle>
      </Container>
    </MinimalLayout>
  )
}

export default UpdatePassword

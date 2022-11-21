// @mui
import {
  Box,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { useForm, FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/api"
import { CreateSessionResponse, UserType } from "@ranklab/api"
import { GetServerSideProps, NextPage } from "next"
import { oidcProvider } from "../api/oidc/[...path]"
import MinimalLayout from "@ranklab/web/layouts/minimal"
import Iconify from "@ranklab/web/components/Iconify"
import NextLink from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string
  password: string
}

interface Props {
  userType: UserType
}

const CreateSessionSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const ContentStyle = styled("div")(() => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
}))

export const getServerSideProps: GetServerSideProps = async (context) => {
  const interaction = await oidcProvider.interactionDetails(
    context.req,
    context.res
  )

  return {
    props: {
      userType: interaction.params.user_type,
    },
  }
}

const OidcLoginPage: NextPage<Props> = function ({ userType }) {
  const defaultValues = {
    email: "",
    password: "",
  }

  const [showPassword, setShowPassword] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(CreateSessionSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValuesProps) => {
    let session: CreateSessionResponse

    try {
      session = await api.client.sessionCreate({
        createSessionRequest: { ...data, userType },
      })
    } catch (error) {
      if (
        error instanceof Response &&
        (error.status === 422 || error.status === 404)
      ) {
        enqueueSnackbar("Invalid email or password. Please try again.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar(
          "There was a problem logging in. Please try again later.",
          { variant: "error" }
        )
      }

      return
    }

    const response = await fetch("/api/oidc/login/finish", {
      method: "POST",
      body: JSON.stringify({ token: session.token }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const json = await response.json()
      window.location.href = json.location
    } else {
      enqueueSnackbar(
        "There was a problem logging in. Please try again later.",
        { variant: "error" }
      )
    }
  }

  return (
    <MinimalLayout>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to Ranklab
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Enter your details below.
              </Typography>
            </Box>
          </Stack>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
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
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              <Iconify
                                icon={
                                  showPassword
                                    ? "eva:eye-fill"
                                    : "eva:eye-off-fill"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
              >
                <NextLink href="/auth/reset-password" passHref>
                  <Link variant="subtitle2">Forgot password?</Link>
                </NextLink>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Login
              </LoadingButton>
            </form>
          </FormProvider>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don’t have an account?{" "}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => {
                signIn("ranklab", {}, { intent: "signup" })
              }}
            >
              Get started
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </MinimalLayout>
  )
}

export default OidcLoginPage

import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Link,
  styled,
} from "@mui/material"
import { UserType, CreateSessionResponse } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { FunctionComponent, useState } from "react"
import { FormProvider, Controller, useForm } from "react-hook-form"
import api from "../api/client"
import Iconify from "./Iconify"
import * as Yup from "yup"
import NextLink from "next/link"

type FormValuesProps = {
  email: string
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
  setShowSignUp: (showSignUp: boolean) => void
}

const CreateSessionSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginForm: FunctionComponent<Props> = function ({
  userType,
  setShowSignUp,
}) {
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
      session = await api.sessionCreate({
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
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
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
            <NextLink
              href={`/auth/reset-password?user_type=${userType}`}
              passHref
            >
              <Link variant="subtitle2">Forgot password?</Link>
            </NextLink>
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ maxWidth: 480 }}
          >
            Login
          </LoadingButton>
        </form>
      </FormProvider>

      {userType === "player" && (
        <Box display="flex" alignItems="center" mt={3}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Don't have an account?
          </Typography>

          <Link
            component="button"
            variant="subtitle2"
            onClick={() => {
              setShowSignUp(true)
            }}
          >
            Get started
          </Link>
        </Box>
      )}
    </ContentStyle>
  )
}

export default LoginForm

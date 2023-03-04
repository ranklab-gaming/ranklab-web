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
import { UserType } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { FormProvider, Controller } from "react-hook-form"
import { api } from "@/api/client"
import { Iconify } from "@/components/Iconify"
import * as Yup from "yup"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useForm } from "@/hooks/useForm"
import { BasicLayout } from "@/components/BasicLayout"

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
}

const CreateSessionSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
})

export function LoginPage({ userType }: Props) {
  const defaultValues = {
    email: "",
    password: "",
  }

  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(CreateSessionSchema),
    serverErrorMessage:
      "There was a problem logging in. Please try again later.",
    errorMessages: {
      404: "Invalid email or password. Please try again.",
    },
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValuesProps) => {
    const session = await api.sessionCreate({
      createSessionRequest: { ...data, userType },
    })

    const response = await fetch("/api/login", {
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

      router.push("/")
    }
  }

  const title = userType === "coach" ? "Coach" : "Player"

  return (
    <BasicLayout title={`${title} Login`}>
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
              <NextLink
                href={`/password/request-reset?user_type=${userType}`}
                passHref
                legacyBehavior
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
              Sign in
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
                router.push("/player/signup")
              }}
            >
              Get started
            </Link>
          </Box>
        )}
      </ContentStyle>
    </BasicLayout>
  )
}

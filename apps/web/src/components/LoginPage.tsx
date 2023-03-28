import { api } from "@/api"
import { BasicLayout } from "./BasicLayout"
import { Iconify } from "./Iconify"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { UserType } from "@ranklab/api"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import * as yup from "yup"

interface Props {
  userType: UserType
}

const FormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
})

type FormValues = yup.InferType<typeof FormSchema>

export const LoginPage = ({ userType }: Props) => {
  const defaultValues: FormValues = {
    email: "",
    password: "",
  }

  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const login = useLogin(userType)
  const { enqueueSnackbar } = useSnackbar()
  const [shouldCheckSessionExpired, setShouldCheckSessionExpired] =
    useState(false)

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
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

  const onSubmit = async (data: FormValues) => {
    const session = await api.sessionCreate({
      createSessionRequest: { ...data, userType },
    })

    await login(session.token)
  }

  useEffect(() => {
    setShouldCheckSessionExpired(true)
  }, [])

  useEffect(() => {
    if (!shouldCheckSessionExpired) return

    const loginSessionExpired = localStorage.getItem("loginSessionExpired")

    if (loginSessionExpired === "true") {
      localStorage.removeItem("loginSessionExpired")

      enqueueSnackbar(
        "The session expired before you could login. Please try again.",
        { variant: "error" }
      )
    }
  }, [enqueueSnackbar, shouldCheckSessionExpired])

  return (
    <BasicLayout title="Sign in to Ranklab">
      <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
        <Box sx={{ flexGrow: 1 }}>
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
                  error={Boolean(error)}
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
                  error={Boolean(error)}
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
            Don&apos;t have an account?
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
    </BasicLayout>
  )
}

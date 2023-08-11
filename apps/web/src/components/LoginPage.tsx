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
import NextLink from "next/link"
import { useEffect, useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import * as yup from "yup"
import { SocialButtons } from "./SocialButtons"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"

const FormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
})

type FormValues = yup.InferType<typeof FormSchema>

export const LoginPage = () => {
  const defaultValues: FormValues = {
    email: "",
    password: "",
  }

  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()
  const { enqueueSnackbar } = useSnackbar()

  const form = useForm({
    resolver: yupResolver(FormSchema),
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
    const session = await api.sessionsCreate({
      createSessionRequest: { credentials: { password: data } },
    })

    await login(session.token)
  }

  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      enqueueSnackbar(
        `There was an error during login: ${router.query.error}`,
        { variant: "error" },
      )
    }
  }, [enqueueSnackbar, router.query.error])

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
          <Stack spacing={3}>
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
                              showPassword
                                ? "eva:eye-outline"
                                : "eva:eye-off-outline"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <NextLink href="/password/request-reset" passHref legacyBehavior>
                <Link variant="subtitle2">Forgot password?</Link>
              </NextLink>
            </Stack>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Sign in
            </LoadingButton>
            <SocialButtons />
          </Stack>
        </form>
      </FormProvider>
      <Box display="flex" alignItems="center" mt={3}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Don&apos;t have an account?
        </Typography>
        <NextLink href="/api/auth/signin?intent=signup" passHref legacyBehavior>
          <Link variant="subtitle2">Get started</Link>
        </NextLink>
      </Box>
    </BasicLayout>
  )
}

import { api } from "@/api"
import { BasicLayout } from "./BasicLayout"
import { Iconify } from "./Iconify"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { UserType } from "@ranklab/api"
import NextLink from "next/link"
import { useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import * as yup from "yup"
import { SocialIcon } from "react-social-icons"

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
  const login = useLogin()

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
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
      createSessionRequest: { credentials: { password: data }, userType },
    })

    await login(session.token)
  }

  return (
    <BasicLayout
      title={
        userType === "player"
          ? "Sign in to Ranklab"
          : "Sign in to Ranklab as a coach"
      }
    >
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
          >
            Sign in
          </LoadingButton>
        </form>
      </FormProvider>
      {/* <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        mt={3}
      >
        <NextLink
          href={`/api/auth/federated/providers/twitch?user_type=${userType}`}
          passHref
          legacyBehavior
        >
          <Button
            aria-label="Sign in with Twitch"
            size="small"
            variant="outlined"
            component="div"
            sx={{
              p: 0,
              minWidth: 40,
              color: "#fff",
              borderColor: "#9146FF",
              "&:hover": {
                borderColor: "#9146FF",
              },
            }}
          >
            <SocialIcon
              network="twitch"
              bgColor="transparent"
              fgColor="#fff"
              style={{ height: 40, width: 40 }}
            />
          </Button>
        </NextLink>
      </Stack> */}
      <Box display="flex" alignItems="center" mt={3}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Don&apos;t have an account?
        </Typography>
        <NextLink href={`/${userType}/signup`} passHref legacyBehavior>
          <Link component="button" variant="subtitle2">
            Get started
          </Link>
        </NextLink>
      </Box>
    </BasicLayout>
  )
}

import { BasicLayout } from "@/components/BasicLayout"
import { LoadingButton } from "@mui/lab"
import { Alert, Box, Link, Stack, Typography } from "@mui/material"
import { useEffect, useId } from "react"
import { SocialButtons } from "./SocialButtons"
import { useLogin } from "@/hooks/useLogin"
import { decode } from "jsonwebtoken"
import {
  AccountFields,
  AccountFieldsSchema,
  AccountFieldsSchemaWithoutPassword,
  AccountFieldsValues,
} from "./AccountFields"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "@/hooks/useForm"
import { api } from "@/api"
import { track } from "@/analytics"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"

interface SignupPageProps {
  token?: string
}

export const SignupPage = ({ token }: SignupPageProps) => {
  const id = useId().slice(1, -1)
  const login = useLogin()
  const jwt = token ? decode(token) : null
  const jwtPayload = typeof jwt === "string" ? null : jwt
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues: AccountFieldsValues = {
    name: jwtPayload?.name ?? "",
    email: jwtPayload?.sub ?? "",
    password: "",
  }

  const form = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      (jwtPayload
        ? AccountFieldsSchemaWithoutPassword
        : AccountFieldsSchema) as typeof AccountFieldsSchema,
    ),
    defaultValues,
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      enqueueSnackbar(
        `There was an error during signup: ${router.query.error}`,
        { variant: "error" },
      )
    }
  }, [enqueueSnackbar, router.query.error])

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const createUser = async (data: AccountFieldsValues) => {
    const session = await api.usersCreate({
      createUserRequest: {
        name: data.name,
        credentials: token
          ? {
              token: {
                token,
              },
            }
          : {
              password: {
                email: data.email,
                password: data.password,
              },
            },
      },
    })

    track("User signup")

    await login(session.token)
  }

  return (
    <BasicLayout title="Sign up to Ranklab">
      <form onSubmit={handleSubmit(createUser)} className={`${id}-form`}>
        <Stack spacing={3}>
          {jwtPayload ? (
            <Alert severity="info">
              To complete your signup, please fill out the details below.
            </Alert>
          ) : null}
          <AccountFields
            control={form.control}
            showPasswordField={!jwtPayload}
          />
          <LoadingButton
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
            sx={{ minWidth: "150px" }}
          >
            Sign up
          </LoadingButton>
          {jwtPayload ? null : <SocialButtons />}
        </Stack>
      </form>
      <Box display="flex" alignItems="center" mt={3}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Already have an account?
        </Typography>
        <NextLink href="/api/auth/signin" passHref legacyBehavior>
          <Link variant="subtitle2">Sign in</Link>
        </NextLink>
      </Box>
    </BasicLayout>
  )
}

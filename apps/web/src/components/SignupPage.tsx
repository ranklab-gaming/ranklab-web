import { BasicLayout } from "@/components/BasicLayout"
import { LoadingButton } from "@mui/lab"
import { Box, Link, Stack, Typography } from "@mui/material"
import { useId } from "react"
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
import { Game, GameId } from "@ranklab/api"
import { track } from "@/analytics"
import NextLink from "next/link"

interface SignupPageProps {
  token?: string
  games: Game[]
}

export const SignupPage = ({ token, games }: SignupPageProps) => {
  const id = useId().slice(1, -1)
  const login = useLogin()
  const jwt = token ? decode(token) : null
  const jwtPayload = typeof jwt === "string" ? null : jwt

  const defaultValues: AccountFieldsValues = {
    gameId: games[0].id,
    name: jwtPayload?.name ?? "",
    email: jwtPayload?.sub ?? "",
    password: "",
    skillLevel: 0,
  }

  const form = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      (jwtPayload
        ? AccountFieldsSchemaWithoutPassword
        : AccountFieldsSchema) as typeof AccountFieldsSchema
    ),
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = form

  const createUser = async (data: AccountFieldsValues) => {
    const session = await api.usersCreate({
      createUserRequest: {
        name: data.name,
        gameId: data.gameId as GameId,
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
          <AccountFields
            control={form.control}
            games={games}
            showPasswordField={!jwtPayload}
            watch={watch}
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
          <SocialButtons />
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

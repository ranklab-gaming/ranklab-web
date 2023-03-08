import { api } from "@/api/client"
import { BasicLayout } from "@/components/BasicLayout"
import { GamesSelect } from "@/components/GamesSelect"
import { Iconify } from "@/components/Iconify"
import {
  PlayerAccountFields,
  PlayerAccountFieldsSchema,
} from "@/components/PlayerAccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import * as yup from "yup"

interface Props {
  games: Game[]
}

type FormValues = yup.InferType<typeof PlayerAccountFieldsSchema>

export function PlayerSignupPage({ games }: Props) {
  const defaultValues: FormValues = {
    email: "",
    password: "",
    gameId: "",
    skillLevel: 0,
    name: "",
  }

  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const login = useLogin("player")

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(PlayerAccountFieldsSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem signin up. Please try again later.",
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = form

  const onSubmit = async (data: FormValues) => {
    const session = await api.playerAccountCreate({
      createPlayerRequest: data,
    })

    await login(session.token)
  }

  return (
    <BasicLayout title="Signup to Ranklab">
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
            <PlayerAccountFields
              games={games}
              control={control}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              watch={watch}
            />
          </Stack>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            sx={{ mt: 3 }}
          >
            <Box
              marginRight="auto"
              flexShrink={0}
              display="flex"
              alignItems="center"
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Already have an account?
              </Typography>
              <Link
                component="button"
                variant="subtitle2"
                onClick={() => {
                  router.push("/player/login")
                }}
              >
                Sign in
              </Link>
            </Box>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ maxWidth: 240 }}
            >
              Sign up
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </BasicLayout>
  )
}

import { api } from "@/api"
import { BasicLayout } from "@/components/BasicLayout"
import { AccountFields, AccountFieldsSchema } from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Box, Link, Stack, Typography } from "@mui/material"
import { Game } from "@ranklab/api"
import { useRouter } from "next/router"
import { FormProvider } from "react-hook-form"
import * as yup from "yup"

interface Props {
  games: Game[]
}

type FormValues = yup.InferType<typeof AccountFieldsSchema>

export const PlayerSignupPage = ({ games }: Props) => {
  const defaultValues: FormValues = {
    email: "",
    password: "",
    gameId: "",
    skillLevel: 0,
    name: "",
  }

  const router = useRouter()
  const login = useLogin("player")

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(AccountFieldsSchema),
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
    <BasicLayout title="Sign up to Ranklab">
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
            <AccountFields
              games={games}
              control={control}
              watch={watch}
              showPasswordField
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

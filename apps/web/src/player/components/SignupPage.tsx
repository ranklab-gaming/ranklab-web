import { api } from "@/api"
import { BasicLayout } from "@/components/BasicLayout"
import { AccountFields, AccountFieldsSchema } from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Box, Link, Stack, Typography } from "@mui/material"
import { Game } from "@ranklab/api"
import { FormProvider } from "react-hook-form"
import * as yup from "yup"
import NextLink from "next/link"

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

  const login = useLogin()

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(AccountFieldsSchema),
    defaultValues,
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
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ mt: 3 }}
          >
            Sign up
          </LoadingButton>
          <Box display="flex" alignItems="center" mt={3}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Already have an account?
            </Typography>

            <NextLink href="/player/login" passHref legacyBehavior>
              <Link variant="subtitle2">Sign in</Link>
            </NextLink>
          </Box>
        </form>
      </FormProvider>
    </BasicLayout>
  )
}

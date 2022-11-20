// @mui
import { Card, Stack, TextField } from "@mui/material"
import { useSnackbar } from "notistack"
import { useForm, FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/api"
import { CreateSessionResponse, UserType } from "@ranklab/api"
import { GetServerSideProps, NextPage } from "next"
import { oidcProvider } from "../api/oidc/[...path]"

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string
  password: string
}

interface Props {
  userType: UserType
}

const CreateSessionSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
})

export const getServerSideProps: GetServerSideProps = async (context) => {
  const interaction = await oidcProvider.interactionDetails(
    context.req,
    context.res
  )

  return {
    props: {
      userType: interaction.params.user_type,
    },
  }
}

const OidcLoginPage: NextPage<Props> = function ({ userType }) {
  const defaultValues = {
    email: "",
    password: "",
  }

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
      session = await api.client.sessionCreate({
        createSessionRequest: { ...data, userType },
      })
    } catch (error) {
      if (error instanceof Response && error.status === 422) {
        enqueueSnackbar("Invalid email or password. Please try again.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar(
          "There was a problem logging in. Please try again later.",
          { variant: "error" }
        )
      }
    }

    const response = await fetch("/api/oidc/login/finish", {
      method: "POST",
      body: JSON.stringify({ token: session!.token }),
    })

    if (response.redirected) {
      window.location.href = response.headers.get("location")!
    } else {
      enqueueSnackbar(
        "There was a problem logging in. Please try again later.",
        { variant: "error" }
      )
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Email" type="email" />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type="password"
                />
              )}
            />
          </Stack>

          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </Stack>
        </Card>
      </form>
    </FormProvider>
  )
}

export default OidcLoginPage

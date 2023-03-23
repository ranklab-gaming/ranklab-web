import { api } from "@/api"
import { coachFromUser, PropsWithUser } from "@/auth"
import {
  CoachAccountFields,
  CoachAccountFieldsSchemaWithoutPassword,
} from "@/components/CoachAccountFields"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Iconify } from "@/components/Iconify"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton, TabContext, TabPanel } from "@mui/lab"
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Switch,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material"
import { Game } from "@ranklab/api"
import NextLink from "next/link"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"

interface Props {
  games: Game[]
}

const FormSchema = yup
  .object()
  .shape({
    emailsEnabled: yup.boolean().required(),
  })
  .concat(CoachAccountFieldsSchemaWithoutPassword)

type FormValues = yup.InferType<typeof FormSchema>

export function CoachAccountPage({ games, user }: PropsWithUser<Props>) {
  const coach = coachFromUser(user)
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const [tab, setTab] = useState("account")

  const defaultValues: FormValues = {
    bio: coach.bio,
    gameId: coach.gameId,
    name: coach.name,
    email: coach.email,
    price: (coach.price / 100).toFixed(2),
    emailsEnabled: coach.emailsEnabled,
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(
      CoachAccountFieldsSchemaWithoutPassword
    ),
    defaultValues,
    serverErrorMessage:
      "There was a problem updating your account. Please try again later.",
  })

  const updateCoach = async (data: FormValues) => {
    await api.coachAccountUpdate({
      updateCoachRequest: {
        name: data.name,
        bio: data.bio,
        gameId: data.gameId,
        email: data.email,
        price: Number(data.price) * 100,
        emailsEnabled: data.emailsEnabled,
      },
    })

    enqueueSnackbar("Account updated successfully", { variant: "success" })
  }

  return (
    <DashboardLayout title="Account" user={user}>
      <TabContext value={tab}>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={(_, value) => setTab(value)}
        >
          <Tab
            disableRipple
            label="General"
            icon={<Iconify icon="eva:info-outline" />}
            value="account"
          />
          <Tab
            disableRipple
            label="Notifications"
            icon={<Iconify icon="eva:bell-outline" />}
            value="notifications"
          />
        </Tabs>
        <TabPanel value="account">
          <form onSubmit={handleSubmit(updateCoach)}>
            <Stack spacing={3} my={4}>
              <Alert
                severity="info"
                action={
                  <NextLink
                    href={`/api/stripe-account-links?${new URLSearchParams({
                      return_url: "/coach/account",
                    })}`}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      color="info"
                      variant="text"
                      size="small"
                      component="a"
                    >
                      OPEN ACCOUNT DASHBOARD
                    </Button>
                  </NextLink>
                }
              >
                We partner with Stripe to handle transactions. You can update
                your personal details using their dashboard.
              </Alert>
              <CoachAccountFields control={control} games={games} />
            </Stack>
            <LoadingButton
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </form>
        </TabPanel>

        <TabPanel value="notifications">
          <form onSubmit={handleSubmit(updateCoach)}>
            <Stack spacing={3} my={4}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: theme.palette.divider,
                  borderRadius: 1,
                }}
              >
                <Controller
                  name="emailsEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" variant="standard">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch {...field} defaultChecked={field.value} />
                          }
                          label="Email notifications"
                        />
                      </FormGroup>
                      <FormHelperText>
                        When enabled, we will send you emails when new
                        recordings are available for review.
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>
            </Stack>
            <LoadingButton
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </form>
        </TabPanel>
      </TabContext>
    </DashboardLayout>
  )
}

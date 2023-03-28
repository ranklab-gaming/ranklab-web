import { api } from "@/api"
import { playerFromUser } from "@/auth"
import { PropsWithUser } from "@/auth"
import {
  AccountFields,
  AccountFieldsSchemaWithoutPassword,
} from "./AccountFields"
import { DashboardLayout } from "@/components/DashboardLayout"
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
} from "@mui/material"
import { Game } from "@ranklab/api"
import { useSnackbar } from "notistack"
import * as yup from "yup"
import { useState } from "react"
import { theme } from "@/theme/theme"
import { Controller } from "react-hook-form"
import { Iconify } from "@/components/Iconify"
import { useRouter } from "next/router"

interface Props {
  games: Game[]
}

const FormSchema = yup
  .object()
  .shape({
    emailsEnabled: yup.boolean().required(),
  })
  .concat(AccountFieldsSchemaWithoutPassword)

type FormValues = yup.InferType<typeof FormSchema>

export const PlayerAccountPage = ({ games, user }: PropsWithUser<Props>) => {
  const player = playerFromUser(user)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const [tab, setTab] = useState(router.query.tab?.toString() ?? "account")

  const defaultValues: FormValues = {
    gameId: player.gameId,
    skillLevel: player.skillLevel,
    name: player.name,
    email: player.email,
    emailsEnabled: player.emailsEnabled,
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(
      AccountFieldsSchemaWithoutPassword
    ),
    defaultValues,
    serverErrorMessage:
      "There was a problem updating your account. Please try again later.",
  })

  const updatePlayer = async (data: FormValues) => {
    await api.playerAccountUpdate({
      updatePlayerRequest: {
        name: data.name,
        skillLevel: data.skillLevel,
        gameId: data.gameId,
        email: data.email,
        emailsEnabled: data.emailsEnabled,
      },
    })

    enqueueSnackbar("Account updated successfully", { variant: "success" })
  }

  const openCustomerPortal = async () => {
    const { url } = await api.playerStripeBillingPortalSessionsCreate({
      createBillingPortalSession: {
        returnUrl: window.location.href,
      },
    })

    window.location.href = url
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
          <form onSubmit={handleSubmit(updatePlayer)}>
            <Stack spacing={3} my={4}>
              <Alert
                severity="info"
                sx={{ mb: 2 }}
                action={
                  <Button
                    color="info"
                    size="small"
                    variant="text"
                    onClick={openCustomerPortal}
                  >
                    OPEN CUSTOMER PORTAL
                  </Button>
                }
              >
                We partner with Stripe to manage payments. You can update your
                payment details using their customer portal.
              </Alert>
              <AccountFields control={control} games={games} watch={watch} />
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
          <form onSubmit={handleSubmit(updatePlayer)}>
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
                        When enabled, we will send you emails when there are
                        events related to your reviews.
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

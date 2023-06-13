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
import { Game, MediaState, Player } from "@ranklab/api"
import { useSnackbar } from "notistack"
import * as yup from "yup"
import { useState } from "react"
import { theme } from "@/theme/theme"
import { Controller } from "react-hook-form"
import { Iconify } from "@/components/Iconify"
import { useRouter } from "next/router"
import { useUpload } from "@/games/video/hooks/useUpload"
import { AvatarSelect } from "@/components/AvatarSelect"
import { uploadsCdnUrl } from "@/config"

interface Props {
  games: Game[]
}

const FormSchema = yup
  .object()
  .shape({
    emailsEnabled: yup.boolean().required(),
    avatar: yup
      .mixed()
      .test(
        "fileSize",
        "Image file must be less than 32MiB",
        (value) =>
          !value ||
          (value instanceof File && value.size > 0 && value.size < 33554432)
      ),
  })
  .concat(AccountFieldsSchemaWithoutPassword)

type FormValues = yup.InferType<typeof FormSchema>

export const PlayerAccountPage = ({ games, user }: PropsWithUser<Props>) => {
  const initialPlayer = playerFromUser(user)
  const [player, setPlayer] = useState<Player>(initialPlayer)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const [tab, setTab] = useState(router.query.tab?.toString() ?? "account")
  const [upload] = useUpload()

  const defaultValues: FormValues = {
    gameId: player.gameId,
    email: player.email,
    skillLevel: player.skillLevel,
    name: player.name,
    emailsEnabled: player.emailsEnabled,
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    resetField,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema as any),
    defaultValues,
  })

  const updatePlayer = async (data: FormValues) => {
    if (data.avatar) {
      const avatar = await api.avatarsCreate({
        body: {},
      })

      if (!avatar.uploadUrl) {
        throw new Error("uploadUrl is missing")
      }

      const headers: Record<string, string> = {
        "x-amz-acl": "public-read",
      }

      if (avatar.instanceId) {
        headers["x-amz-meta-instance-id"] = avatar.instanceId
      }

      await upload({
        file: data.avatar as File & {},
        url: avatar.uploadUrl,
        headers,
      })

      const avatarId = avatar.id

      const poll = async (retries = 10): Promise<boolean> => {
        const avatar = await api.avatarsGet({ id: avatarId })

        if (avatar.state === MediaState.Processed) {
          return true
        }

        if (retries === 0) {
          return false
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        return await poll(retries - 1)
      }

      if (!(await poll())) {
        enqueueSnackbar(
          "An error occurred while uploading your avatar. Please try again.",
          {
            variant: "error",
          }
        )
      }
    } else if (initialPlayer.avatarImageKey && !player.avatarImageKey) {
      await api.avatarsDelete()
    }

    await api.playerAccountUpdate({
      updatePlayerRequest: {
        name: data.name,
        skillLevel: data.skillLevel,
        gameId: data.gameId,
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
              <AccountFields control={control} games={games} watch={watch}>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <AvatarSelect
                      defaultAvatarUrl={
                        player.avatarImageKey
                          ? `${uploadsCdnUrl}/${player.avatarImageKey}`
                          : undefined
                      }
                      onChange={field.onChange}
                      onClear={() => {
                        setPlayer((player) => ({
                          ...player,
                          avatarImageKey: null,
                        }))
                        resetField("avatar")
                      }}
                    />
                  )}
                />
              </AccountFields>
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

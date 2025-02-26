import { api } from "@/api"
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
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Switch,
  Tab,
  Tabs,
} from "@mui/material"
import { Game, MediaState } from "@ranklab/api"
import { useSnackbar } from "notistack"
import * as yup from "yup"
import { useState } from "react"
import { theme } from "@/theme/theme"
import { Controller } from "react-hook-form"
import { Iconify } from "@/components/Iconify"
import { useRouter } from "next/router"
import { useUpload } from "@/hooks/useUpload"
import { uploadsCdnUrl } from "@/config"
import { AvatarSelect } from "./AccountPage/AvatarSelect"
import { assertProp } from "@/assert"

interface Props {
  games: Game[]
}

const FormSchema = yup
  .object()
  .shape({
    emailsEnabled: yup.boolean().defined(),
    avatar: yup
      .object()
      .shape({
        file: yup
          .mixed({
            check: (value: any): value is File => value instanceof File,
          })
          .defined()
          .test(
            "fileSize",
            "Image file must be less than 32MiB",
            (value) => value.size > 0 && value.size < 33554432,
          ),
      })
      .optional()
      .nullable(),
  })
  .concat(AccountFieldsSchemaWithoutPassword)

type FormValues = yup.InferType<typeof FormSchema>

export const AccountPage = ({
  games,
  user: initialUser,
}: PropsWithUser<Props>) => {
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [tab, setTab] = useState(router.query.tab?.toString() ?? "account")
  const [upload] = useUpload()

  const defaultValues: FormValues = {
    email: user.email,
    name: user.name,
    emailsEnabled: user.emailsEnabled,
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const updateUser = async (data: FormValues) => {
    if (data.avatar) {
      const newAvatar = await api.avatarsCreate()
      const url = assertProp(newAvatar, "uploadUrl")
      const headers: Record<string, string> = { "x-amz-acl": "public-read" }

      if (newAvatar.instanceId) {
        headers["x-amz-meta-instance-id"] = newAvatar.instanceId
      }

      await upload({
        file: data.avatar.file,
        url,
        headers,
      })

      const poll = async (retries = 30): Promise<boolean> => {
        const avatar = await api.avatarsGet({ id: newAvatar.id })

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
          },
        )

        return
      }
    } else if (data.avatar === null) {
      await api.avatarsDelete()
    }

    setUser(
      await api.usersUpdate({
        updateUserRequest: {
          name: data.name,
          emailsEnabled: data.emailsEnabled,
        },
      }),
    )

    setValue("avatar", undefined, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })

    enqueueSnackbar("Account updated successfully", { variant: "success" })
  }

  return (
    <DashboardLayout title="Account" user={user} games={games}>
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
          <form onSubmit={handleSubmit(updateUser)}>
            <Stack spacing={3} my={4}>
              <AccountFields control={control}>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <AvatarSelect
                      defaultAvatarUrl={
                        user.avatarImageKey && field.value !== null
                          ? `${uploadsCdnUrl}/${user.avatarImageKey}`
                          : undefined
                      }
                      onChange={(file) => {
                        field.onChange({ file })
                      }}
                      onClear={() => {
                        setValue("avatar", null, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        })
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
          <form onSubmit={handleSubmit(updateUser)}>
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
                        events related to your VODs.
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

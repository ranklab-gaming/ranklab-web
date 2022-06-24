// @mui
import { Box, Card, Stack, TextField } from "@mui/material"
import useUser from "@ranklab/web/hooks/useUser"
import { useSnackbar } from "notistack"
import { useForm, FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string
  email: string
  bio?: string
  type: string
}

const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  bio: Yup.string().when("type", {
    is: "Coach",
    then: Yup.string().required("Bio is required"),
  }),
  type: Yup.string().required(),
})

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar()

  const user = useUser()

  const defaultValues = {
    name: user.name,
    email: user.email,
    bio: user.type === "Coach" ? user.bio : undefined,
    type: user.type,
  }

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (_data: FormValuesProps) => {
    try {
      enqueueSnackbar("Profile updated successfully")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Name"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Email"
                />
              )}
            />

            {user.type === "Coach" && (
              <Controller
                name="bio"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label="Bio"
                  />
                )}
              />
            )}
          </Box>

          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Card>
      </form>
    </FormProvider>
  )
}

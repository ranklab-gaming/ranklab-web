import { Stack, TextField } from "@mui/material"
import { PropsWithChildren } from "react"
import { Control, Controller, Path } from "react-hook-form"
import * as yup from "yup"

export const AccountFieldsSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
})

export const AccountFieldsSchemaWithoutPassword = AccountFieldsSchema.omit([
  "password",
])

export type AccountFieldsValues = yup.InferType<typeof AccountFieldsSchema>

interface Props {
  control: Control<any>
  showPasswordField?: boolean
}
export const AccountFields = ({
  control,
  showPasswordField = false,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Controller
          name={"name" as Path<AccountFieldsValues>}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              error={Boolean(error)}
              fullWidth
              helperText={
                error ? error.message : "This will appear on your profile"
              }
            />
          )}
        />
        {children}
      </Stack>
      <Controller
        name={"email" as Path<AccountFieldsValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            error={Boolean(error)}
            helperText={error ? error.message : "The email you use to login"}
            label="Email"
            type="email"
            disabled={!showPasswordField}
          />
        )}
      />
      {showPasswordField ? (
        <Controller
          name={"password" as Path<AccountFieldsValues>}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={Boolean(error)}
              helperText={
                error ? error.message : "The password you use to login"
              }
              label="Password"
              type="password"
            />
          )}
        />
      ) : null}
    </>
  )
}

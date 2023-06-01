import { Editor } from "@/components/Editor"
import { GameSelect } from "@/components/GameSelect"
import {
  TextField,
  InputAdornment,
  Stack,
  FormHelperText,
  Box,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { PropsWithChildren } from "react"
import { Control, Controller, Path } from "react-hook-form"
import * as yup from "yup"

export const AccountFieldsSchema = yup.object().shape({
  bio: yup
    .string()
    .required("Bio is required")
    .min(30, "Bio must be at least 30 characters"),
  gameId: yup.string().required("Game is required"),
  password: yup.string().required("Password is required"),
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  price: yup
    .string()
    .required("Price is required")
    .matches(
      /^\d+\.?\d{0,2}$/,
      "Price must be a number with no more than 2 decimal places"
    )
    .test("is-in-range", "Price must be between $1 and $500", (value) => {
      const numberValue = parseFloat(value)
      return numberValue >= 1 && numberValue <= 500
    }),
})

export const AccountFieldsSchemaWithoutPassword = AccountFieldsSchema.omit([
  "password",
])

export type AccountFieldsValues = yup.InferType<typeof AccountFieldsSchema>

interface Props {
  games: Game[]
  control: Control<any>
  showPasswordField?: boolean
  gameDisabled?: boolean
}

export const AccountFields = ({
  control,
  games,
  showPasswordField = false,
  gameDisabled = false,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <Controller
        name={"gameId" as Path<AccountFieldsValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <GameSelect
            {...field}
            games={games}
            error={Boolean(error)}
            disabled={gameDisabled}
            helperText={
              error ? error.message : "The game you offer coaching for"
            }
          />
        )}
      />
      <Stack spacing={2} direction="row" alignItems="center">
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
                error
                  ? error.message
                  : "This is how you'll appear in your profile"
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
            type="email"
            label="Email"
            error={Boolean(error)}
            helperText={error ? error?.message : "The email you use to log in"}
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
              type="password"
              label="Password"
              error={Boolean(error)}
              helperText={
                error ? error.message : "The password you use to log in"
              }
            />
          )}
        />
      ) : null}
      <Controller
        name={"bio" as Path<AccountFieldsValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Box>
            <Editor
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(error)}
            />
            <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
              {error
                ? error.message
                : "Tell us about yourself and your coaching experience"}
            </FormHelperText>
          </Box>
        )}
      />
      <Controller
        name={"price" as Path<AccountFieldsValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Price"
            error={Boolean(error)}
            helperText={
              error
                ? error.message
                : "The price you charge per review (you can always change this later)"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        )}
      />
    </>
  )
}

import { GameSelect } from "@/components/GameSelect"
import { TextField, InputAdornment } from "@mui/material"
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
    ),
})

export const AccountFieldsSchemaWithoutPassword = AccountFieldsSchema.omit([
  "password",
])

type FormValuesWithPassword = yup.InferType<typeof AccountFieldsSchema>

type FormValuesWithoutPassword = yup.InferType<
  typeof AccountFieldsSchemaWithoutPassword
>

type FormValues<TWithPassword extends boolean> = TWithPassword extends true
  ? FormValuesWithPassword
  : FormValuesWithoutPassword

interface Props<
  TWithPassword extends boolean,
  TFormValues extends FormValues<TWithPassword>
> {
  games: Game[]
  control: Control<TFormValues>
  showPasswordField?: TWithPassword
  gameDisabled?: boolean
}

export const AccountFields = <
  TWithPassword extends boolean,
  TFormValues extends FormValues<TWithPassword>
>({
  control,
  games,
  showPasswordField = false as TWithPassword,
  gameDisabled = false,
  children,
}: PropsWithChildren<Props<TWithPassword, TFormValues>>) => {
  return (
    <>
      <Controller
        name={"name" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Name"
            error={Boolean(error)}
            helperText={
              error
                ? error.message
                : "This is how you'll appear in your profile"
            }
          />
        )}
      />
      <Controller
        name={"email" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            type="email"
            label="Email"
            error={Boolean(error)}
            helperText={error ? error?.message : "The email you use to log in"}
          />
        )}
      />
      {showPasswordField ? (
        <Controller
          name={"password" as Path<TFormValues>}
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
      {children}
      <Controller
        name={"bio" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Bio"
            error={Boolean(error)}
            multiline
            rows={4}
            helperText={
              error
                ? error.message
                : "Tell us about yourself and your coaching experience"
            }
          />
        )}
      />
      <Controller
        name={"gameId" as Path<TFormValues>}
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
      <Controller
        name={"price" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Price"
            error={Boolean(error)}
            helperText={
              error ? error.message : "The price you charge per review"
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

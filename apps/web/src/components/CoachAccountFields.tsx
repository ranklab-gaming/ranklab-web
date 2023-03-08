import { GamesSelect } from "@/components/GamesSelect"
import { TextField, InputAdornment } from "@mui/material"
import { Game } from "@ranklab/api"
import { Control, Controller, Path } from "react-hook-form"
import * as yup from "yup"

export const CoachAccountFieldsSchema = yup.object({
  bio: yup
    .string()
    .required("Bio is required")
    .min(30, "Bio must be at least 30 characters"),
  gameId: yup.string().required("Game is required"),
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

type FormValues = yup.InferType<typeof CoachAccountFieldsSchema>

interface Props<TFormValues extends FormValues> {
  games: Game[]
  control: Control<TFormValues>
}

export function CoachAccountFields<TFormValues extends FormValues>({
  control,
  games,
}: Props<TFormValues>) {
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
          <GamesSelect
            {...field}
            games={games}
            error={Boolean(error)}
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
            helperText={error ? error.message : "The price you charge per VOD"}
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

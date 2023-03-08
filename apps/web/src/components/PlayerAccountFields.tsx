import { GamesSelect } from "@/components/GamesSelect"
import { Iconify } from "@/components/Iconify"
import { TextField, InputAdornment, IconButton, MenuItem } from "@mui/material"
import { Game } from "@ranklab/api"
import { Control, Controller, Path, UseFormWatch } from "react-hook-form"
import * as yup from "yup"

export const PlayerAccountFieldsSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  gameId: yup.string().required("Game is required"),
  skillLevel: yup.number().required("Skill level is required"),
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
})

type FormValues = yup.InferType<typeof PlayerAccountFieldsSchema>

interface Props<TFormValues extends FormValues> {
  games: Game[]
  control: Control<TFormValues>
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
  watch: UseFormWatch<TFormValues>
}

export function PlayerAccountFields<TFormValues extends FormValues>({
  control,
  games,
  showPassword,
  setShowPassword,
  watch,
}: Props<TFormValues>) {
  const gameId = watch("gameId" as Path<TFormValues>)
  const selectedGame: Game | undefined = games.find((g) => g.id === gameId)

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
            helperText={error?.message}
          />
        )}
      />
      <Controller
        name={"email" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            error={!!error}
            helperText={error?.message}
            label="Email"
            type="email"
          />
        )}
      />
      <Controller
        name={"password" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            error={!!error}
            helperText={error?.message}
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Controller
        name={"gameId" as Path<TFormValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <GamesSelect
            games={games}
            value={field.value as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={Boolean(error)}
            helperText={error?.message}
          />
        )}
      />
      {selectedGame && (
        <Controller
          name={"skillLevel" as Path<TFormValues>}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              select
              {...field}
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              label="Skill Level"
            >
              {selectedGame.skillLevels.map((skillLevel) => (
                <MenuItem key={skillLevel.value} value={skillLevel.value}>
                  {skillLevel.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      )}
    </>
  )
}

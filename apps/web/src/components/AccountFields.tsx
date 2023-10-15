import { Link, MenuItem } from "@mui/material"
import { GameSelect } from "./AccountFields/GameSelect"
import { Stack, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import { PropsWithChildren, useState } from "react"
import { Control, Controller, Path, UseFormWatch } from "react-hook-form"
import * as yup from "yup"
import { GameRequestDialog } from "./AccountFields/GameRequestDialog"
import { assertFind } from "@/assert"

export const AccountFieldsSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  gameId: yup.string().required("Game is required"),
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  skillLevel: yup.number().required("Skill level is required"),
})

export const AccountFieldsSchemaWithoutPassword = AccountFieldsSchema.omit([
  "password",
])

export type AccountFieldsValues = yup.InferType<typeof AccountFieldsSchema>

interface Props {
  games: Game[]
  control: Control<any>
  showPasswordField?: boolean
  watch: UseFormWatch<any>
}
export const AccountFields = ({
  control,
  games,
  showPasswordField = false,
  children,
  watch,
}: PropsWithChildren<Props>) => {
  const [showGameRequestDialog, setShowGameRequestDialog] = useState(false)
  const gameId = watch("gameId")
  const game = assertFind(games, (game) => game.id === gameId)

  return (
    <>
      <Controller
        name={"gameId" as Path<AccountFieldsValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <GameSelect
            games={games}
            value={field.value as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={Boolean(error)}
            helperText={
              error ? (
                error.message
              ) : (
                <>
                  The game you play. Don&apos;t see your game?{" "}
                  <Link
                    onClick={() => setShowGameRequestDialog(true)}
                    sx={{ cursor: "pointer" }}
                    color="secondary"
                    underline="hover"
                  >
                    Let us know!
                  </Link>
                  <GameRequestDialog
                    open={showGameRequestDialog}
                    onClose={() => setShowGameRequestDialog(false)}
                  />
                </>
              )
            }
          />
        )}
      />
      <Controller
        name={"skillLevel" as Path<AccountFieldsValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            select
            {...field}
            label="Skill Level"
            error={Boolean(error)}
            helperText={error ? error.message : `Your skill level`}
          >
            {game.skillLevels.map((skillLevel) => (
              <MenuItem key={skillLevel.value} value={skillLevel.value}>
                {skillLevel.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
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

import { api } from "@/api"
import { GameSelect } from "@/components/GameSelect"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  TextField,
  MenuItem,
  Link,
  Dialog,
  DialogContent,
  Box,
  DialogTitle,
  Typography,
  Stack,
  Button,
  DialogActions,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { Control, Controller, Path, UseFormWatch } from "react-hook-form"
import * as yup from "yup"

export const AccountFieldsSchema = yup.object().shape({
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
  watch: UseFormWatch<TFormValues>
  showPasswordField?: TWithPassword
  showGameRequestDialog?: boolean
}

const GameRequestSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
})

type GameRequestFormValues = yup.InferType<typeof GameRequestSchema>

export const AccountFields = <
  TWithPassword extends boolean,
  TFormValues extends FormValues<TWithPassword>
>({
  control,
  games,
  watch,
  showPasswordField = false as TWithPassword,
  showGameRequestDialog = false,
}: Props<TWithPassword, TFormValues>) => {
  const gameId = watch("gameId" as Path<TFormValues>)
  const selectedGame: Game | undefined = games.find((g) => g.id === gameId)
  const [gameRequestDialogOpen, setGameRequestDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const gameRequestForm = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: yupResolver(GameRequestSchema),
    mode: "onSubmit",
    errorMessages: {
      422: "Game request already sent. We'll get back to you soon.",
    },
  })

  const requestGame = async (values: GameRequestFormValues) => {
    await api.gameCreate({
      createGameRequest: {
        name: values.name,
        email: values.email,
      },
    })

    setGameRequestDialogOpen(false)

    enqueueSnackbar("Game request sent! We'll get back to you soon.", {
      variant: "success",
    })
  }

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
              error ? error.message : "This will appear on your profile"
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
            fullWidth
            error={Boolean(error)}
            helperText={error ? error.message : "The email you use to login"}
            label="Email"
            type="email"
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
      <Controller
        name={"gameId" as Path<TFormValues>}
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
              ) : showGameRequestDialog ? (
                <Typography variant="caption" color="textSecondary">
                  Don&apos;t see your game? Use{" "}
                  <Link
                    color="secondary.main"
                    fontWeight="bold"
                    sx={{ verticalAlign: "baseline" }}
                    component="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setGameRequestDialogOpen(true)
                    }}
                  >
                    our form
                  </Link>{" "}
                  and ask for it to be added
                  <Dialog
                    open={gameRequestDialogOpen}
                    maxWidth="lg"
                    onClose={() => setGameRequestDialogOpen(false)}
                  >
                    <DialogTitle>
                      <Box p={3} pb={0}>
                        Request a Game
                      </Box>
                    </DialogTitle>
                    <DialogContent>
                      <form>
                        <Box p={3} pb={0} minWidth={480}>
                          <Stack spacing={3}>
                            <Controller
                              name="email"
                              control={gameRequestForm.control}
                              render={({ field, fieldState: { error } }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  error={Boolean(error)}
                                  helperText={
                                    error
                                      ? error.message
                                      : "The email we can use to contact you once the game is added"
                                  }
                                  label="Email"
                                  type="email"
                                />
                              )}
                            />
                            <Controller
                              name="name"
                              control={gameRequestForm.control}
                              render={({ field, fieldState: { error } }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  error={Boolean(error)}
                                  helperText={
                                    error
                                      ? error.message
                                      : "The name of the game you want to be added"
                                  }
                                  label="Game"
                                />
                              )}
                            />
                          </Stack>
                          <LoadingButton
                            type="button"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            loading={gameRequestForm.formState.isSubmitting}
                            disabled={gameRequestForm.formState.isSubmitting}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              gameRequestForm.handleSubmit(requestGame)()
                            }}
                          >
                            Submit Request
                          </LoadingButton>
                        </Box>
                      </form>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setGameRequestDialogOpen(false)}
                        color="primary"
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Typography>
              ) : (
                "The game you want to be coached in"
              )
            }
          />
        )}
      />
      {selectedGame ? (
        <Controller
          name={"skillLevel" as Path<TFormValues>}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              select
              {...field}
              fullWidth
              error={Boolean(error)}
              helperText={
                error ? error.message : "Your skill level in the game"
              }
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
      ) : null}
    </>
  )
}

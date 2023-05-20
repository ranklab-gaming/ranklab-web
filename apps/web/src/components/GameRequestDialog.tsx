import { api } from "@/api"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { Controller } from "react-hook-form"
import * as yup from "yup"

const FormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
})

type FormValues = yup.InferType<typeof FormSchema>

interface Props {
  open: boolean
  onClose: () => void
}

export const GameRequestDialog = ({ open, onClose }: Props) => {
  const { enqueueSnackbar } = useSnackbar()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: yupResolver(FormSchema),
    mode: "onSubmit",
    errorMessages: {
      422: "Game request already sent. We'll get back to you soon.",
    },
  })

  const requestGame = async (values: FormValues) => {
    await api.playerGamesCreate({
      createGameRequest: {
        name: values.name,
        email: values.email,
      },
    })

    onClose()

    enqueueSnackbar("Game request sent! We'll get back to you soon.", {
      variant: "success",
    })
  }

  return (
    <Dialog open={open} maxWidth="lg" onClose={onClose}>
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
                control={form.control}
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
                control={form.control}
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
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit(requestGame)()
              }}
            >
              Submit Request
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

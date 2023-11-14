import { CreateRecordingRequest, Game, GameId, MediaState } from "@ranklab/api"
import { Controller } from "react-hook-form"
import { api } from "@/api"
import { Editor } from "@/components/Editor"
import { LoadingButton } from "@mui/lab"
import {
  Stack,
  TextField,
  FormHelperText,
  Box,
  MenuItem,
  Typography,
  Link,
  Paper,
  LinearProgress,
} from "@mui/material"
import { PropsWithChildren, useState } from "react"
import { useRouter } from "next/router"
import { assertFind } from "@/assert"
import { useSnackbar } from "notistack"
import { useUpload } from "@/hooks/useUpload"
import { VideoFileSelect } from "./VideoFileSelect"
import { GuideDialog } from "./RecordingForm/GuideDialog"
import { formatBytes } from "@/helpers/formatBytes"
import { GameSelect } from "./GameSelect"
import * as yup from "yup"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"

export interface RecordingFormProps {
  games: Game[]
  footerElement?: JSX.Element | null
}

const RecordingFormSchema = yup.object().shape({
  skillLevel: yup.number().required("Skill level is required"),
  gameId: yup.string().required("Game is required"),
  title: yup.string().required("Title is required"),
  notes: yup.string().defined(),
  video: yup
    .mixed({
      check(value): value is File {
        return value instanceof File
      },
    })
    .test(
      "required",
      "Video is required",
      (value) => value && value instanceof File && value.size > 0,
    )
    .test(
      "fileSize",
      "Video file must be less than 4GiB",
      (value) => value && value instanceof File && value.size < 4294967296,
    ),
})

type RecordingFormValues = yup.InferType<typeof RecordingFormSchema>

export const RecordingForm = ({
  games,
}: PropsWithChildren<RecordingFormProps>) => {
  const router = useRouter()

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<RecordingFormValues>({
    resolver: yupResolver(RecordingFormSchema),
    defaultValues: {
      skillLevel: 0,
      gameId: router.query.game?.toString() ?? "",
      title: "",
      notes: "",
    },
  })

  const gameId = watch("gameId")
  const game = gameId ? assertFind(games, (g) => g.id === gameId) : null
  const [guideDialogOpen, setGuideDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [upload, { progress: uploadProgress, uploading }] = useUpload()
  const title = watch("title") as string
  const video = watch("video") as File | undefined
  const [previewURL, setPreviewURL] = useState<string | undefined>(undefined)

  const submit = async function (values: RecordingFormValues) {
    const request: CreateRecordingRequest = {
      title: values.title,
      notes: values.notes,
      gameId: values.gameId as GameId,
      skillLevel: values.skillLevel,
    }

    const recording = await api.recordingsCreate({
      createRecordingRequest: request,
    })

    if (video) {
      if (!recording.uploadUrl) {
        throw new Error("uploadUrl is missing")
      }

      const headers: Record<string, string> = {
        "x-amz-acl": "public-read",
      }

      if (recording.instanceId) {
        headers["x-amz-meta-instance-id"] = recording.instanceId
      }

      await upload({
        file: video,
        url: recording.uploadUrl,
        headers,
      })

      const waitForRecordingUploaded = async (
        retries = 30,
      ): Promise<boolean> => {
        const updatedRecording = await api.recordingsGet({
          id: recording.id,
        })

        if (updatedRecording.state !== MediaState.Created) {
          return true
        }

        if (retries === 0) {
          return false
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        return waitForRecordingUploaded(retries - 1)
      }

      if (!(await waitForRecordingUploaded())) {
        enqueueSnackbar(
          "There was an error submitting your VOD. Please try again later.",
          {
            variant: "error",
          },
        )

        return
      }
    }

    await router.push(`/recordings/${recording.id}`)
    enqueueSnackbar("VOD submitted successfully", { variant: "success" })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack spacing={3} mt={4}>
        <Controller
          name="video"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <VideoFileSelect
              name={field.name}
              value={field.value as File | null}
              onBlur={field.onBlur}
              onChange={(file) => {
                if (!title && file) {
                  setValue("title", file.name.split(".")[0], {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }

                field.onChange(file)

                if (previewURL) {
                  URL.revokeObjectURL(previewURL)
                }

                if (file) {
                  setPreviewURL(URL.createObjectURL(file))
                } else {
                  setPreviewURL(undefined)
                }
              }}
              error={Boolean(error)}
              helperText={
                error ? (
                  error.message
                ) : (
                  <>
                    <Typography variant="caption" color="textSecondary">
                      Not sure how to record your gameplay? Check out{" "}
                      <Link
                        color="secondary.main"
                        fontWeight="bold"
                        component="button"
                        sx={{
                          verticalAlign: "baseline",
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setGuideDialogOpen(true)
                        }}
                      >
                        our guide
                      </Link>
                      .
                    </Typography>
                    <GuideDialog
                      open={guideDialogOpen}
                      onClose={() => setGuideDialogOpen(false)}
                    />
                  </>
                )
              }
            />
          )}
        />
        {previewURL ? (
          <Paper
            elevation={4}
            sx={{
              p: 2,
              bgcolor: "grey.800",
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video src={previewURL} controls style={{ height: "100%" }} />
          </Paper>
        ) : null}
        <Controller
          name="gameId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <GameSelect
              games={games}
              value={field.value as string}
              onChange={(gameId) => {
                field.onChange(gameId)

                setValue("skillLevel", 0, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }}
              onBlur={field.onBlur}
              error={Boolean(error)}
              helperText={error ? error.message : "The game of this VOD"}
            />
          )}
        />
        {game ? (
          <Controller
            name="skillLevel"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                select
                {...field}
                label="Skill Level"
                error={Boolean(error)}
                helperText={
                  error ? error.message : "Your skill level in this VOD"
                }
              >
                {game.skillLevels.map((skillLevel) => (
                  <MenuItem key={skillLevel.value} value={skillLevel.value}>
                    {skillLevel.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ) : null}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Title"
              error={Boolean(error)}
              helperText={
                error ? error.message : "A title to help you remember this VOD"
              }
            />
          )}
        />
        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Box mt={2} title="Notes">
                <Editor
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                />
                <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                  {error
                    ? error.message
                    : "Any notes you want to add for this VOD (optional)"}
                </FormHelperText>
              </Box>
            )
          }}
        />
      </Stack>
      {uploading ? (
        <Stack spacing={1} direction="row" alignItems="center" mt={2}>
          <Box flexGrow={1}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              color="secondary"
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {`${uploadProgress}% (${formatBytes(
                (video?.size ?? 0) * (uploadProgress / 100),
              )} / ${formatBytes(video?.size ?? 0)})`}
            </Typography>
          </Box>
        </Stack>
      ) : null}
      <LoadingButton
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={isSubmitting}
        sx={{ mt: 3 }}
      >
        Submit VOD
      </LoadingButton>
    </form>
  )
}

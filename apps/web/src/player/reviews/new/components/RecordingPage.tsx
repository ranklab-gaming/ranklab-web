import { api } from "@/api"
import { playerFromUser, PropsWithUser } from "@/auth"
import { Stepper } from "./Stepper"
import { VideoFileSelect } from "@/player/components/VideoFileSelect"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { CreateRecordingRequest, Recording, RecordingState } from "@ranklab/api"
import { useUpload } from "@/hooks/useUpload"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "@/components/DashboardLayout"
import NextLink from "next/link"
import { updateSessionReview } from "@/api"
import { GuideDialog } from "./RecordingPage/GuideDialog"
import { formatBytes } from "@/player/helpers/formatBytes"
import { RecordingVideo } from "@/player/components/RecordingVideo"
import { useSnackbar } from "notistack"
import { formatDate } from "@/helpers/formatDate"
import { uploadsCdnUrl } from "@/config"
import { Iconify } from "@/components/Iconify"
import NextImage from "next/image"

const newRecordingId = "NEW_RECORDING"

interface FormValues {
  recordingId: string
  newRecordingTitle: string
  newRecordingVideo?: File
  newRecordingMetadata?: any
}

interface Props {
  recordings: Recording[]
  recordingId?: string
}

export const PlayerReviewsNewRecordingPage = ({
  recordings,
  user,
  recordingId: initialRecordingId,
}: PropsWithUser<Props>) => {
  const router = useRouter()
  const player = playerFromUser(user)
  const theme = useTheme()
  const [guideDialogOpen, setGuideDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const recordingLabel = player.gameId === "chess" ? "Game" : "Recording"
  const lowercaseRecordingLabel = recordingLabel.toLowerCase()

  let formSchema = yup.object().shape({
    recordingId: yup.string().required("Recording is required"),
    newRecordingTitle: yup.string().when("recordingId", {
      is: newRecordingId,
      then: () => yup.string().required("Title is required"),
    }),
  })

  if (player.gameId === "chess") {
    formSchema = formSchema.shape({
      newRecordingMetadata: yup.object().when("recordingId", {
        is: newRecordingId,
        then: () => yup.object().required("PGN is required"),
      }),
    })
  } else {
    formSchema = formSchema.shape({
      newRecordingVideo: yup.mixed().when("recordingId", {
        is: newRecordingId,
        then: () =>
          yup
            .mixed()
            .test(
              "required",
              "Video is required",
              (value) => value && value instanceof File && value.size > 0
            )
            .test(
              "fileSize",
              "Video file must be less than 4GiB",
              (value) =>
                value && value instanceof File && value.size < 4294967296
            ),
      }),
    })
  }

  const defaultValues: FormValues = {
    recordingId: initialRecordingId ?? newRecordingId,
    newRecordingTitle: "",
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(formSchema),
    defaultValues,
  })

  const recordingId = watch("recordingId")
  const newRecordingVideo = watch("newRecordingVideo")
  const newRecordingTitle = watch("newRecordingTitle")
  const newRecordingMetadata = watch("newRecordingMetadata")

  const selectedRecording =
    recordingId === newRecordingId
      ? null
      : recordings.find((r) => r.id === recordingId)

  const [upload, { progress: uploadProgress, uploading }] = useUpload()

  const submit = async function (values: FormValues) {
    let recordingId = values.recordingId

    if (values.recordingId === newRecordingId) {
      let request: CreateRecordingRequest = {
        title: values.newRecordingTitle,
        skillLevel: player.skillLevel,
        gameId: player.gameId,
      }

      if (newRecordingMetadata) {
        request = {
          ...request,
          metadata: newRecordingMetadata,
        }
      }

      const recording = await api.playerRecordingsCreate({
        createRecordingRequest: request,
      })

      if (newRecordingVideo) {
        if (!recording.uploadUrl) {
          throw new Error("uploadUrl is missing")
        }

        await upload({
          file: newRecordingVideo,
          url: recording.uploadUrl,
          headers: {
            "X-Amz-Acl": "public-read",
          },
        })

        const waitForRecordingUploaded = async (
          retries = 10
        ): Promise<boolean> => {
          const updatedRecording = await api.playerRecordingsGet({
            id: recording.id,
          })

          if (updatedRecording.state !== RecordingState.Created) {
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
            `There was an error uploading your ${lowercaseRecordingLabel}. Please try again later.`,
            {
              variant: "error",
            }
          )

          return
        }
      }

      recordingId = recording.id
    }

    await updateSessionReview({ recordingId })
    await router.push("/player/reviews/new/coach")
  }

  return (
    <DashboardLayout
      user={user}
      title={`Request a Review | Choose a ${recordingLabel}`}
      showTitle={false}
    >
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Box p={3}>
              <Stepper activeStep={0} />
              <form onSubmit={handleSubmit(submit)}>
                <Stack spacing={3} mt={4}>
                  <Controller
                    name="recordingId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        select
                        label={recordingLabel}
                        onChange={field.onChange}
                        value={field.value}
                        onBlur={field.onBlur}
                        error={Boolean(error)}
                        helperText={
                          error
                            ? error.message
                            : `The ${lowercaseRecordingLabel} you want to be reviewed`
                        }
                      >
                        <MenuItem value={newRecordingId}>
                          New {lowercaseRecordingLabel}
                        </MenuItem>
                        {recordings.map((recording) => (
                          <MenuItem key={recording.id} value={recording.id}>
                            <Stack direction="row" spacing={2}>
                              {recording.state === RecordingState.Processed ? (
                                <NextImage
                                  src={`${uploadsCdnUrl}/${recording.thumbnailKey}`}
                                  width={100}
                                  height={60}
                                  alt={recording.title}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <Paper
                                  sx={{
                                    backgroundColor: theme.palette.grey[900],
                                    width: 100,
                                    height: 60,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 0,
                                  }}
                                >
                                  <Iconify icon="eva:film-outline" />
                                </Paper>
                              )}
                              <Stack spacing={1}>
                                <Typography variant="body1">
                                  {recording.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  Created on {formatDate(recording.createdAt)}
                                </Typography>
                              </Stack>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  {recordingId === newRecordingId && (
                    <Stack spacing={3}>
                      {user.gameId === "chess" ? (
                        <>
                          <Controller
                            name="newRecordingMetadata"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                onChange={(event) => {
                                  field.onChange({
                                    ...newRecordingMetadata,
                                    chess: {
                                      ...newRecordingMetadata?.chess,
                                      pgn: event.currentTarget.value,
                                    },
                                  })
                                }}
                                value={field.value?.chess?.pgn}
                                label="PGN"
                                error={Boolean(error)}
                                multiline
                                rows={4}
                                helperText={
                                  error ? error.message : "The game PGN file"
                                }
                              />
                            )}
                          />
                          <Controller
                            name="newRecordingMetadata"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormControl>
                                <InputLabel>Color</InputLabel>
                                <Select
                                  {...field}
                                  onChange={(event) => {
                                    field.onChange({
                                      ...newRecordingMetadata,
                                      chess: {
                                        ...newRecordingMetadata?.chess,
                                        playerColor: event.target.value,
                                      },
                                    })
                                  }}
                                  value={field.value?.chess?.playerColor}
                                  label="Color"
                                  error={Boolean(error)}
                                  defaultValue="white"
                                >
                                  <MenuItem key="white" value="white">
                                    White
                                  </MenuItem>
                                  <MenuItem key="black" value="black">
                                    Black
                                  </MenuItem>
                                </Select>
                                <FormHelperText>
                                  {error
                                    ? error.message
                                    : "The color you played as in the game"}
                                </FormHelperText>
                              </FormControl>
                            )}
                          />
                        </>
                      ) : (
                        <Controller
                          name="newRecordingVideo"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <VideoFileSelect
                              {...field}
                              onChange={(file) => {
                                if (!newRecordingTitle && file) {
                                  setValue(
                                    "newRecordingTitle",
                                    file.name.split(".")[0],
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: true,
                                    }
                                  )
                                }

                                field.onChange(file)
                              }}
                              error={Boolean(error)}
                              helperText={
                                error ? (
                                  error.message
                                ) : (
                                  <>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      Not sure how to record your gameplay?
                                      Check out{" "}
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
                      )}
                      <Controller
                        name="newRecordingTitle"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Title"
                            error={Boolean(error)}
                            helperText={
                              error
                                ? error.message
                                : `A title to help you remember this ${lowercaseRecordingLabel}`
                            }
                          />
                        )}
                      />
                    </Stack>
                  )}
                  {uploading ? (
                    <Stack spacing={1} direction="row" alignItems="center">
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
                            (newRecordingVideo?.size ?? 0) *
                              (uploadProgress / 100)
                          )} / ${formatBytes(newRecordingVideo?.size ?? 0)})`}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : null}
                </Stack>
                {selectedRecording ? (
                  <Paper
                    elevation={4}
                    sx={{
                      mt: 2,
                      backgroundColor: theme.palette.grey[900],
                    }}
                  >
                    <RecordingVideo
                      recording={selectedRecording}
                      style={{ maxHeight: 400 }}
                    />
                  </Paper>
                ) : null}
                <Stack direction="row">
                  <NextLink href="/player/dashboard" passHref legacyBehavior>
                    <Button variant="text" component={Link} sx={{ mt: 3 }}>
                      Cancel
                    </Button>
                  </NextLink>
                  <Box sx={{ flexGrow: 1 }} />
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || uploading}
                    disabled={isSubmitting || uploading}
                    sx={{ mt: 3 }}
                  >
                    Continue
                  </LoadingButton>
                </Stack>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  )
}

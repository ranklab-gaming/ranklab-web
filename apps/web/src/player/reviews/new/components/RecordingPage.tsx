import { api } from "@/api"
import { playerFromUser, PropsWithUser } from "@/auth"
import { Stepper } from "./Stepper"
import { VideoFileSelect } from "@/components/VideoFileSelect"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton, TabContext, TabPanel } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { Recording } from "@ranklab/api"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "@/components/DashboardLayout"
import NextLink from "next/link"
import { useSnackbar } from "notistack"
import { saveReview } from "@/api/session"
import { assertProp } from "@/assert"
import { uploadsCdnUrl } from "@/config"
import { Iconify } from "@/components/Iconify"
import NextImage from "next/image"
import windowsStep1 from "@/images/recording-guide/windows-1.png"
import windowsStep2 from "@/images/recording-guide/windows-2.png"
import windowsStep3 from "@/images/recording-guide/windows-3.png"

const newRecordingId = "NEW_RECORDING"

const FormSchema = yup.object().shape({
  recordingId: yup.string().required("Recording is required"),
  newRecordingTitle: yup.string().when("recordingId", {
    is: newRecordingId,
    then: () => yup.string().required("Title is required"),
  }),
  newRecordingVideo: yup.mixed().when("recordingId", {
    is: newRecordingId,
    then: () =>
      yup
        .mixed()
        .test(
          "required",
          "Video is required",
          (value) => value && value instanceof File && value.size > 0
        ),
  }),
})

interface FormValues {
  recordingId: string
  newRecordingTitle: string
  newRecordingVideo?: File
}

interface Props {
  recordings: Recording[]
  recordingId?: string
}

export function PlayerReviewsNewRecordingPage({
  recordings: initialRecordings,
  user,
  recordingId: initialRecordingId,
}: PropsWithUser<Props>) {
  const router = useRouter()
  const [recordings, setRecordings] = useState<Recording[]>(initialRecordings)
  const [newRecording, setNewRecording] = useState<Recording | null>(null)
  const player = playerFromUser(user)
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false)
  const [recordingDialogTab, setRecordingDialogTab] = useState("windows")

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
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const recordingId = watch("recordingId")
  const newRecordingVideo = watch("newRecordingVideo")
  const newRecordingTitle = watch("newRecordingTitle")

  const selectedRecording =
    recordingId === newRecordingId
      ? null
      : recordings.find((r) => r.id === recordingId)

  const [
    upload,
    {
      progress: uploadProgress,
      loading: uploading,
      done: uploadDone,
      error: uploadError,
    },
  ] = useUpload(async ({ files }) => {
    const file = assertProp(files, 0)
    const uploadUrl = assertProp(newRecording, "uploadUrl")

    return {
      method: "PUT",
      url: uploadUrl,
      body: file,
      headers: {
        "X-Amz-Acl": "public-read",
      },
    }
  })

  const goToNextStep = async function (values: FormValues) {
    if (values.recordingId === newRecordingId) {
      const newRecordingVideo = assertProp(values, "newRecordingVideo")

      const recording = await api.playerRecordingsCreate({
        createRecordingRequest: {
          mimeType: newRecordingVideo.type,
          size: newRecordingVideo.size,
          title: values.newRecordingTitle,
          skillLevel: player.skillLevel,
          gameId: player.gameId,
        },
      })

      setNewRecording(recording)

      return
    }

    await saveReview({
      recordingId: values.recordingId,
    })

    await router.push("/player/reviews/new/coach")
  }

  useEffect(() => {
    if (!uploadDone || !newRecording) {
      return
    }

    setRecordings([...recordings, newRecording])
    setValue("recordingId", newRecording.id)
    handleSubmit(goToNextStep)()
  }, [uploadDone])

  useEffect(() => {
    if (!newRecordingVideo || !newRecording) {
      return
    }

    upload({
      files: {
        ...[newRecordingVideo],
        item: () => newRecordingVideo,
      },
    })
  }, [newRecording])

  useEffect(() => {
    if (!uploadError) {
      return
    }

    enqueueSnackbar(
      "An error occurred while uploading your video. Please try again.",
      {
        variant: "error",
      }
    )
  }, [uploadError])

  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Choose a Recording"
      showTitle={false}
    >
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Box p={3}>
              <Stepper activeStep={0} />
              <form onSubmit={handleSubmit(goToNextStep)}>
                <Stack spacing={3} mt={4}>
                  <Controller
                    name="recordingId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        select
                        label="Recording"
                        onChange={field.onChange}
                        value={field.value}
                        onBlur={field.onBlur}
                        error={Boolean(error)}
                        helperText={
                          error
                            ? error.message
                            : "The recording you want to be reviewed"
                        }
                      >
                        <MenuItem value={newRecordingId}>
                          Upload a new recording
                        </MenuItem>
                        {recordings.map((recording) => (
                          <MenuItem key={recording.id} value={recording.id}>
                            {recording.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  {recordingId === newRecordingId && (
                    <Stack spacing={3}>
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
                                    Not sure how to record your gameplay? Check
                                    out {""}
                                    <Link
                                      color="info.main"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setRecordingDialogOpen(true)
                                      }}
                                    >
                                      our guide
                                    </Link>
                                    .
                                  </Typography>
                                  <Dialog
                                    open={recordingDialogOpen}
                                    fullWidth
                                    maxWidth="lg"
                                    onClose={() =>
                                      setRecordingDialogOpen(false)
                                    }
                                  >
                                    <DialogTitle>
                                      How to Record Your Gameplay
                                    </DialogTitle>
                                    <DialogContent>
                                      <TabContext value={recordingDialogTab}>
                                        <Tabs
                                          allowScrollButtonsMobile
                                          variant="scrollable"
                                          scrollButtons="auto"
                                          value={recordingDialogTab}
                                          onChange={(_, value) =>
                                            setRecordingDialogTab(value)
                                          }
                                        >
                                          <Tab
                                            disableRipple
                                            label="Windows"
                                            icon={
                                              <Iconify icon="mdi:windows" />
                                            }
                                            value="windows"
                                          />
                                          <Tab
                                            disableRipple
                                            label="Mac"
                                            icon={<Iconify icon="mdi:apple" />}
                                            value="mac"
                                          />
                                          <Tab
                                            disableRipple
                                            label="Linux"
                                            icon={<Iconify icon="mdi:linux" />}
                                            value="linux"
                                          />
                                        </Tabs>
                                        <TabPanel value="windows">
                                          <Typography
                                            variant="body1"
                                            mt={2}
                                            gutterBottom
                                          >
                                            To record your gameplay on Windows,
                                            we recommend using Xbox Game Bar.
                                            You can open it by pressing{" "}
                                            <Iconify icon="mdi:windows" /> + G.
                                            If you want to start recording
                                            immediately without opening the Game
                                            Bar, you can press{" "}
                                            <Iconify icon="mdi:windows" /> + Alt
                                            + R.
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            gutterBottom
                                          >
                                            We recommend using the 30 FPS and
                                            Standard video quality settings or
                                            anything lower than that. This will
                                            ensure that your video is not too
                                            large to upload.
                                          </Typography>
                                          <Typography variant="body1">
                                            You can find the configuration
                                            options for Xbox Game Bar by
                                            following the steps below.
                                          </Typography>
                                          <Stack spacing={2} mt={2}>
                                            <NextImage
                                              src={windowsStep1}
                                              width={728}
                                              quality={100}
                                              height={438}
                                              alt="Xbox Game Bar Step 1"
                                            />
                                            <NextImage
                                              src={windowsStep2}
                                              width={728}
                                              quality={100}
                                              height={503}
                                              alt="Xbox Game Bar Step 2"
                                            />
                                            <NextImage
                                              src={windowsStep3}
                                              width={728}
                                              quality={100}
                                              height={503}
                                              alt="Xbox Game Bar Step 3"
                                            />
                                          </Stack>
                                        </TabPanel>
                                        <TabPanel value="mac">
                                          <Typography variant="body1" mt={2}>
                                            Our Mac guide is coming soon. Stay
                                            tuned!
                                          </Typography>
                                        </TabPanel>
                                        <TabPanel value="linux">
                                          <Typography variant="body1" mt={2}>
                                            Our Linux guide is coming soon. Stay
                                            tuned!
                                          </Typography>
                                        </TabPanel>
                                      </TabContext>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button
                                        onClick={() =>
                                          setRecordingDialogOpen(false)
                                        }
                                        color="primary"
                                      >
                                        Close
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </>
                              )
                            }
                          />
                        )}
                      />
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
                                : "A title to help you remember this recording"
                            }
                          />
                        )}
                      />
                    </Stack>
                  )}
                  {uploading && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress ?? 0}
                      color="info"
                    />
                  )}
                </Stack>
                {selectedRecording && (
                  <Paper
                    elevation={4}
                    sx={{
                      mt: 2,
                      backgroundColor: theme.palette.grey[900],
                    }}
                  >
                    <video
                      height="400"
                      width="100%"
                      controls
                      key={selectedRecording.id}
                    >
                      <source
                        src={`${uploadsCdnUrl}/${selectedRecording.videoKey}`}
                        type={selectedRecording.mimeType}
                      />
                    </video>
                  </Paper>
                )}
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

import { PropsWithUser } from "@/auth"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  Stack,
  Typography,
  Paper,
  Grid,
  CardActionArea,
  TextField,
  InputAdornment,
} from "@mui/material"
import { useRouter } from "next/router"
import * as yup from "yup"
import { DashboardLayout } from "@/components/DashboardLayout"
import NextLink from "next/link"
import { Coach } from "@ranklab/api"
import { updateSessionReview } from "@/api/sessionReview"
import { Stepper } from "./Stepper"
import { useGameDependency } from "@/hooks/useGameDependency"
import { useSnackbar } from "notistack"
import { Chip } from "@mui/material"
import { useState } from "react"
import { Iconify } from "@/components/Iconify"
import { formatPrice } from "@/player/helpers/formatPrice"
import { m } from "framer-motion"
import { Avatar } from "@/components/Avatar"

const FormSchema = yup.object().shape({
  coachId: yup.string().required("Coach is required"),
})

type FormValues = yup.InferType<typeof FormSchema>

interface Props {
  coaches: Coach[]
  coachId?: string
}

const Content = ({ coaches, coachId }: Props) => {
  const router = useRouter()

  const defaultValues: FormValues = {
    coachId: coachId ?? "",
  }

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    watch,
    setValue,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const goToNextStep = async function (values: FormValues) {
    await updateSessionReview({
      coachId: values.coachId,
    })

    await router.push("/player/reviews/new/recording")
  }

  const RecordingForm = useGameDependency("component:recording-form")
  const recordingCreatedSuccess = useGameDependency(
    "text:recording-created-success"
  )
  const submitText = useGameDependency("text:recording-submit-button")
  const [searchTerm, setSearchTerm] = useState("")
  const { enqueueSnackbar } = useSnackbar()
  const selectedCoachId = watch("coachId")

  const filteredCoaches = coaches.filter((coach) =>
    coach.name
      .toLowerCase()
      .concat(coach.bio.toLowerCase())
      .includes(searchTerm.toLowerCase())
  )

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Box p={3}>
            <Stepper activeStep={0} />
            {coaches.length === 0 ? (
              <Box p={8}>
                <Paper sx={{ bgcolor: "grey.900", p: 4 }} elevation={4}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    Sorry, there are no coaches for this game yet.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    In the meanwhile you can upload a recording of your game.
                    Once a coach joins the platform we will notify you and
                    you&apos;ll be able to request a review.
                  </Typography>
                </Paper>

                <Box mt={4}>
                  <RecordingForm
                    recordings={[]}
                    onSubmit={async () => {
                      enqueueSnackbar(recordingCreatedSuccess, {
                        variant: "success",
                      })
                    }}
                    submitText={submitText}
                    forReview={false}
                  />
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(goToNextStep)}>
                <Box mt={4} mb={2}>
                  <TextField
                    type="search"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a coach"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Iconify icon="eva:search-outline" fontSize={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Grid container spacing={2}>
                  {filteredCoaches.map((coach) => (
                    <Grid item xs={12} sm={6} md={4} key={coach.id}>
                      <Card
                        sx={{
                          bgcolor:
                            coach.id === selectedCoachId
                              ? "secondary.main"
                              : "grey.900",
                        }}
                      >
                        <CardActionArea
                          title={coach.name}
                          onClick={() =>
                            setValue(
                              "coachId",
                              coach.id === selectedCoachId ? "" : coach.id,
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              }
                            )
                          }
                        >
                          <CardHeader
                            title={
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={1}
                              >
                                <Avatar user={coach} />
                                <Box>{coach.name}</Box>
                                <Chip
                                  size="small"
                                  label={formatPrice(coach.price)}
                                />
                              </Stack>
                            }
                            subheader={`${coach.reviewsCount} completed reviews`}
                          />
                          <CardContent>
                            <Typography
                              variant="body1"
                              component={m.div}
                              minHeight={80}
                              initial={false}
                              variants={{
                                animate: { height: 80 },
                                selected: { height: "auto" },
                              }}
                              animate={
                                selectedCoachId === coach.id
                                  ? "selected"
                                  : "animate"
                              }
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {selectedCoachId === coach.id ? (
                                <pre
                                  style={{
                                    fontFamily: "inherit",
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: coach.bio,
                                  }}
                                />
                              ) : (
                                coach.bioText
                              )}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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
                    loading={isSubmitting}
                    disabled={isSubmitting || !isValid}
                    sx={{ mt: 3 }}
                  >
                    Continue
                  </LoadingButton>
                </Stack>
              </form>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export const PlayerReviewsNewCoachPage = ({
  user,
  coaches,
  coachId,
}: PropsWithUser<Props>) => {
  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Choose a Coach"
      showTitle={false}
    >
      <Content coaches={coaches} coachId={coachId} />
    </DashboardLayout>
  )
}

import {
  Card,
  Typography,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material"
import { useCallback, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { UploadSingleFile } from "src/components/upload"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { Recording } from "@ranklab/api"
import api from "@ranklab/web/src/api"
import withPageOnboardingRequired from "@ranklab/web/helpers/withPageOnboardingRequired"
import NextLink from "next/link"

import DashboardLayout from "src/layouts/dashboard"
// @mui
import { Grid, Step, Stepper, Container, StepLabel } from "@mui/material"
import Page from "@ranklab/web/components/Page"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"

// ----------------------------------------------------------------------

export const getServerSideProps = withPageOnboardingRequired()

// ----------------------------------------------------------------------

export default function NewRecordingForm() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [recording, setRecording] = useState<Recording | null>(null)
  const router = useRouter()

  const handleDropFile = useCallback((files) => {
    setFiles(files)
  }, [])

  let [upload, { progress, done, loading }] = useUpload(async ({ files }) => {
    const file = files[0]

    if (!file) {
      return
    }

    const recording = await api.client.playerRecordingsCreate({
      createRecordingRequest: { mimeType: file.type, size: file.size },
    })

    setRecording(recording)

    return {
      method: "PUT",
      url: recording.uploadUrl,
      body: file,
      headers: {
        "X-Amz-Acl": "public-read",
      },
    }
  })

  useEffect(() => {
    if (done) {
      if (!recording) {
        throw new Error("Recording not found")
      }

      router.push("/r/[id]", `/r/${recording.id}`)
    }
  }, [done, recording])

  return (
    <Page title="Dashboard | Upload your recording">
      <Container maxWidth="lg">
        <NewReviewHeader activeStep="upload" />

        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    height: "217px",
                    padding: "40px 8px",
                  }}
                >
                  <NextLink
                    href={`${process.env.NEXT_PUBLIC_ASSETS_CDN_URL}/RanklabSetup.exe`}
                    download
                  >
                    <Button variant="contained" color="info">
                      Download Client
                    </Button>
                  </NextLink>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              OR
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ position: "static" }}>
              <CardContent>
                <UploadSingleFile
                  file={files?.[0] ?? null}
                  onDrop={handleDropFile}
                />
                {loading && (
                  <LinearProgress variant="determinate" value={progress ?? 0} />
                )}
                {files && (
                  <Button
                    disabled={loading}
                    onClick={() => upload({ files: files })}
                  >
                    Upload
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

NewRecordingForm.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

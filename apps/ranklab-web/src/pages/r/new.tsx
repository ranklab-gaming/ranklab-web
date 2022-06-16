import {
  Card,
  Container,
  Typography,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material"
import { FunctionComponent, useCallback, useState, useEffect } from "react"
import { useRouter } from "next/router"
import Page from "src/components/Page"
import { UploadSingleFile } from "src/components/upload"
import DashboardLayout from "src/layouts/dashboard"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { Recording } from "@ranklab/api"
import api from "@ranklab/web/src/api"
import withPageOnboardingRequired from "@ranklab/web/helpers/withPageOnboardingRequired"
import NextLink from "next/link"

interface NewRecordingFormProps {}

export const getServerSideProps = withPageOnboardingRequired()

const NewRecordingForm: FunctionComponent<NewRecordingFormProps> = () => {
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
    <DashboardLayout>
      <Page title="Dashboard | Upload your recording">
        <Container maxWidth="xl">
          <NextLink href="https://ranklab-production-assets.s3.eu-west-2.amazonaws.com/RanklabSetup.exe">
            <Button variant="contained" color="info">
              Download Client
            </Button>
          </NextLink>

          <Typography variant="h3" component="h1" paragraph>
            Upload your recording
          </Typography>

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
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default NewRecordingForm

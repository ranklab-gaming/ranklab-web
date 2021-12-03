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
import Uploader from "src/components/Uploader"
import DashboardLayout from "src/layouts/dashboard"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { Recording } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import api from "@ranklab/web/src/api"

interface NewRecordingFormProps {
  recording: Recording
}

const getDashboardServerSideProps: GetServerSideProps<NewRecordingFormProps> =
  async function (ctx) {
    const recording = await api.server(ctx).recordingsCreate()

    return {
      props: {
        recording,
      },
    }
  }

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
})

const NewRecordingForm: FunctionComponent<NewRecordingFormProps> = ({
  recording,
}) => {
  const [files, setFiles] = useState<FileList | null>(null)
  const router = useRouter()

  const handleDropFile = useCallback((files) => {
    setFiles(files)
  }, [])

  let [upload, { progress, done, loading }] = useUpload(async ({ files }) => {
    return {
      method: "PUT",
      url: recording.uploadUrl,
      body: files[0],
      headers: {
        "X-Amz-Acl": "public-read",
      },
    }
  })

  useEffect(() => {
    if (done) {
      router.push("/r/[id]", `/r/${recording.id}`)
    }
  }, [done])

  return (
    <DashboardLayout>
      <Page title="Dashboard | Upload your recording">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Upload your recording
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <Uploader file={files?.[0] ?? null} onDrop={handleDropFile} />
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

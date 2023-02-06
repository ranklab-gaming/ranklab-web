import { Card, CardContent, Button, LinearProgress } from "@mui/material"
import { useCallback, useState, useEffect, FunctionComponent } from "react"
import { useRouter } from "next/router"
import { UploadSingleFile } from "src/components/upload"
import { useUpload } from "@zach.codes/use-upload/lib/react"
import { Coach, Recording } from "@ranklab/api"
import api from "@ranklab/web/src/api/server"
import clientApi from "@ranklab/web/src/api/client"
import withPageAuthRequired, {
  PropsWithSession,
} from "@ranklab/web/helpers/withPageAuthRequired"

import DashboardLayout from "src/layouts/dashboard"
// @mui
import { Container } from "@mui/material"
import Page from "@ranklab/web/components/Page"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"
import { useRequiredParam } from "@ranklab/web/hooks/useParam"

// ----------------------------------------------------------------------

export const getServerSideProps = withPageAuthRequired({
  requiredUserType: "player",
  getServerSideProps: async function (ctx) {
    const coachId = useRequiredParam(ctx, "coach_id")
    const server = await api(ctx)
    const coach = await server.playerCoachesGet({ coachId })
    return { props: { coach } }
  },
})

interface Props {
  coach: Coach
}

// ----------------------------------------------------------------------

const NewRecordingForm: FunctionComponent<PropsWithSession<Props>> = function ({
  coach,
}) {
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

    const recording = await clientApi.playerRecordingsCreate({
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

      router.push(
        "/player/recordings/[id]",
        `/player/recordings/${recording.id}`
      )
    }
  }, [done, recording])

  return (
    <DashboardLayout>
      <Page title="Dashboard | Upload your recording">
        <Container maxWidth="lg">
          <NewReviewHeader activeStep="upload" />

          <Card sx={{ position: "static" }}>
            <CardContent>
              <UploadSingleFile
                file={files?.[0] ?? null}
                onDrop={handleDropFile}
                coach={coach}
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

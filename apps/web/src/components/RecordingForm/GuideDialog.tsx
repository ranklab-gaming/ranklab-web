import { Iconify } from "@/components/Iconify"
import { assetsCdnUrl } from "@/config"
import { theme } from "@/theme/theme"
import { TabContext, TabPanel } from "@mui/lab"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Typography,
  Stack,
  Paper,
  Grid,
  DialogActions,
  Button,
} from "@mui/material"
import { useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
}

const windowsSteps = [
  `Search "Settings" in the Windows search bar`,
  `Choose "Gaming" from the sidebar`,
  `Choose "Captures"`,
  `Adjust Xbox Game Bar settings`,
]

const reduceSteps = [
  `Search "Clipchamp" in the Windows search bar`,
  `Click "Create a new video" in the main window`,
  `Click "Import media" in the top left corner`,
  `Drag your video from the "Media" tab to the timeline at the bottom`,
  `Click "Export" in the top right corner`,
  `Optionally, give your video a name and wait for it to export`,
]

export const GuideDialog = ({ open, onClose }: Props) => {
  const [recordingDialogTab, setRecordingDialogTab] = useState("windows")

  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle gutterBottom>How to Record Your Gameplay</DialogTitle>
      <DialogContent>
        <TabContext value={recordingDialogTab}>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={recordingDialogTab}
            onChange={(_, value) => setRecordingDialogTab(value)}
          >
            <Tab
              disableRipple
              label="Windows"
              icon={<Iconify icon="mdi:windows" />}
              value="windows"
            />
          </Tabs>
          <TabPanel value="windows">
            <Typography variant="body1" mt={2} gutterBottom>
              To record your gameplay on Windows, we recommend using Xbox Game
              Bar. You can open it by pressing <Iconify icon="mdi:windows" /> +
              G. If you want to start recording immediately without opening the
              Game Bar, you can press <Iconify icon="mdi:windows" /> + Alt + R.
            </Typography>
            <Typography variant="body1" gutterBottom>
              We recommend using the 30 FPS and Standard video quality settings
              or anything lower than that. This will ensure that your video is
              not too large to upload.
            </Typography>
            <Typography variant="body1">
              You can find the configuration options for Xbox Game Bar by
              following the steps below.
            </Typography>
            <Stack spacing={2} mt={2}>
              {windowsSteps.map((step, index) => (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.grey[900],
                  }}
                  key={index}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <img
                        src={`${assetsCdnUrl}/images/recording-guide/windows-${
                          index + 1
                        }.webp`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        alt={`Windows Step ${index + 1}`}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" gutterBottom>
                        {index + 1}. {step}.
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
            <Typography variant="body1" mt={2}>
              If you have a large video file, you can use a video editing
              software to reduce the file size. We recommend using Clipchamp,
              which is free and easy to use. You can follow the steps below to
              reduce your video file size.
            </Typography>
            <Stack spacing={2} mt={2}>
              {reduceSteps.map((step, index) => (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.grey[900],
                  }}
                  key={index}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <img
                        src={`${assetsCdnUrl}/images/recording-guide/reduce-${
                          index + 1
                        }.webp`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        alt={`Reduce Step ${index + 1}`}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" gutterBottom>
                        {index + 1}. {step}.
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

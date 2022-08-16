import {
  Box,
  Grid,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  styled,
} from "@mui/material"
import { FunctionComponent } from "react"
import Iconify from "./Iconify"

const STEPS = [
  {
    label: "Upload VOD",
    id: "upload",
  },
  {
    label: "Submit VOD for review",
    id: "submit",
  },
  {
    label: "Payment",
    id: "payment",
  },
] as const

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  "&.Mui-active, &.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
}))

function QontoStepIcon({
  active,
  completed,
}: {
  active: boolean
  completed: boolean
}) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "primary.main" : "text.disabled",
      }}
    >
      {completed ? (
        <Iconify
          icon={"eva:checkmark-fill"}
          sx={{ zIndex: 1, width: 20, height: 20, color: "primary.main" }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </Box>
  )
}

interface Props {
  activeStep: typeof STEPS[number]["id"]
  allCompleted?: boolean
}

const NewReviewHeader: FunctionComponent<Props> = ({
  activeStep,
  allCompleted = false,
}) => {
  const activeIndex = STEPS.findIndex((step) => step.id === activeStep)

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8} sx={{ mb: 5 }}>
        <Stepper
          alternativeLabel
          activeStep={activeIndex}
          connector={<QontoConnector />}
        >
          {STEPS.map(({ label, id }) => (
            <Step key={id}>
              <StepLabel
                StepIconComponent={(props) =>
                  allCompleted ? (
                    <QontoStepIcon active={false} completed={true} />
                  ) : (
                    <QontoStepIcon {...props} />
                  )
                }
                sx={{
                  "& .MuiStepLabel-label": {
                    typography: "subtitle2",
                    color: "text.disabled",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  )
}

export default NewReviewHeader

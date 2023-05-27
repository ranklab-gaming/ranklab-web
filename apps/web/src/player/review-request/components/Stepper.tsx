import { Iconify } from "@/components/Iconify"
import { useGameDependency } from "@/hooks/useGameDependency"
import {
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  Stack,
  Stepper as MuiStepper,
  Step,
  StepLabel,
  styled,
} from "@mui/material"
import { ReactElement } from "react"

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg,${theme.palette.primary.main} 0%,${theme.palette.error.main} 50%,${theme.palette.secondary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg,${theme.palette.primary.main} 0%,${theme.palette.error.main} 50%,${theme.palette.secondary.main} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[700],
    borderRadius: 1,
  },
}))

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[500],
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient( 136deg,${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
  }),
}))

const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props

  const icons: { [index: string]: ReactElement } = {
    1: <Iconify icon="mdi:school-outline" />,
    2: <Iconify icon="eva:video-outline" />,
    3: <Iconify icon="eva:credit-card-outline" />,
    4: <Iconify icon="eva:shopping-cart-outline" />,
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

interface Props {
  activeStep: number
}

export const Stepper = ({ activeStep }: Props) => {
  const recordingStep = useGameDependency("text:recording-step")
  const steps = ["Choose a Coach", recordingStep, "Billing Details", "Checkout"]

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <MuiStepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
    </Stack>
  )
}

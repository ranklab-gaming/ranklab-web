import { Stepper as BaseStepper } from "@/components/Stepper"
import { StepperProps } from "@/games/video/components/Stepper"

const Stepper = ({ activeStep }: StepperProps) => {
  return <BaseStepper activeStep={activeStep} recordingStep="Paste a PGN" />
}

export default Stepper

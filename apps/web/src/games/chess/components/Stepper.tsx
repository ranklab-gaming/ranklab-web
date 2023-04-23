import { Stepper as BaseStepper } from "@/components/Stepper"

export interface StepperProps {
  activeStep: number
}

const Stepper = ({ activeStep }: StepperProps) => {
  return <BaseStepper activeStep={activeStep} recordingStep="Paste a PGN" />
}

export default Stepper

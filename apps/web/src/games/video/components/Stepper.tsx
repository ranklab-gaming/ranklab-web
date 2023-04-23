import { Stepper as BaseStepper } from "@/components/Stepper"

export interface StepperProps {
  activeStep: number
}

const Stepper = ({ activeStep }: StepperProps) => {
  return (
    <BaseStepper activeStep={activeStep} recordingStep="Choose a Recording" />
  )
}

export default Stepper

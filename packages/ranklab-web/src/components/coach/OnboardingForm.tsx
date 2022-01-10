import { FunctionComponent } from "react";

export type FormValuesProps = {
  bio: string
  gameId: string
  name: string
}

export const defaultValues = {
  title: "",
  gameId: "",
  notes: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  bio: Yup.string().required("Bio is required"),
  gameId: Yup.string().required("Game is required"),
  name: Yup.string().required("Name is required"),
})

const CoachOnboardingForm: FunctionComponent<{}> = () => {
  return (  );
}

export default CoachOnboardingForm;
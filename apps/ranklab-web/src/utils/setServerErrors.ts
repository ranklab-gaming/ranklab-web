import { capitalize } from "lodash"
import { FieldValues, Path, UseFormSetError } from "react-hook-form"

interface LengthErrorParams {
  min?: number
  max?: number
}

type Params = LengthErrorParams
type Code = "length" | "custom"

type Errors<T> = {
  [key in Path<T>]: Error[]
}

interface Error {
  message?: string
  code: Code
  params: Params
}

function errorMessageFromError<T>(field: Path<T>, error: Error) {
  switch (error.code) {
    case "length":
      return `${capitalize(field)} must be at least ${
        error.params.min
      } characters long`
  }

  return `${capitalize(field)} is invalid`
}

export default function setServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Errors<T>
) {
  let field: Path<T>

  for (field in errors) {
    setError(field, {
      type: "server",
      message: errors[field]
        .map((e) => errorMessageFromError(field, e))
        .join(", "),
    })
  }
}

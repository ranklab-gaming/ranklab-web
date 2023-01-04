import { capitalize } from "lodash"
import { FieldValues, Path, UseFormSetError } from "react-hook-form"

type Errors<T> = {
  [key in Path<T>]: Error[]
}

type Error = {
  message?: string
} & (
  | {
      code: "length"
      params: {
        min?: number
        max?: number
      }
    }
  | {
      code: "custom"
      params: {}
    }
)

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

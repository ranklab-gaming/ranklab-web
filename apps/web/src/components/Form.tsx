import { ResponseError } from "@ranklab/api"
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

function setServerErrors<T extends FieldValues>(
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

interface FailsafeSubmitOptions<T extends FieldValues, U> {
  onServerError?: () => void
  errorHandlers?: Record<number, () => void>
  setError: UseFormSetError<T>
  request: Promise<U>
}

export async function failsafeSubmit<T extends FieldValues, U>({
  onServerError,
  errorHandlers = {},
  request,
  setError,
}: FailsafeSubmitOptions<T, U>): Promise<U | undefined> {
  try {
    return request
  } catch (e: any) {
    if (e instanceof Response || e instanceof ResponseError) {
      const response = e instanceof Response ? e : e.response
      const errorHandler = errorHandlers[response.status]

      if (errorHandler) {
        errorHandler()
        return
      }

      if (response.status === 422) {
        const errors = await response.json()

        if ("error" in errors && !Array.isArray(errors.error)) {
          onServerError?.()
          return
        }

        setServerErrors(setError, errors)
        return
      }

      if (response.status >= 500) {
        onServerError?.()
        return
      }
    }

    throw e
  }
}

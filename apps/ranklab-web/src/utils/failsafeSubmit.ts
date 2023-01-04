import { ResponseError } from "@ranklab/api"
import setServerErrors from "@ranklab/web/utils/setServerErrors"
import { FieldValues, UseFormSetError } from "react-hook-form"

interface FailsafeSubmitOptions<T extends FieldValues, U> {
  onServerError?: () => void
  errorHandlers?: Record<number, () => void>
  setError: UseFormSetError<T>
  request: Promise<U>
}

export default async function failsafeSubmit<T extends FieldValues, U>({
  onServerError,
  errorHandlers = {},
  request,
  setError,
}: FailsafeSubmitOptions<T, U>): Promise<U | undefined> {
  try {
    return await request
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

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
    if (e instanceof Response) {
      const errorHandler = errorHandlers[e.status]

      if (errorHandler) {
        errorHandler()
        return
      }

      if (e.status === 422) {
        const errors = await e.json()
        setServerErrors(setError, errors)
        return
      }

      if (e.status >= 500) {
        onServerError?.()
        return
      }
    }

    throw e
  }
}

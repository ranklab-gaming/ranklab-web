import setServerErrors from "@ranklab/web/utils/setServerErrors"
import { UseFormSetError } from "react-hook-form"

export default async function failsafeSubmit<T, U>(
  setError: UseFormSetError<T>,
  onServerError: () => void,
  requestPromise: Promise<U>
): Promise<U | undefined> {
  try {
    return await requestPromise
  } catch (e: any) {
    if (e instanceof Response) {
      if (e.status === 422) {
        const errors = await e.json()
        setServerErrors(setError, errors)
        return
      } else if (e.status >= 500) {
        onServerError()
      }
    }

    throw e
  }
}

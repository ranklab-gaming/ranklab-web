import { ResponseError } from "@ranklab/api"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"

export function useLogin() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  return async (token: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const json = await response.json()
      window.location.href = json.location
      return
    }

    if (response.status === 400) {
      enqueueSnackbar("The session expired before you could sign in. Please try again.", {
        variant: "error",
      })

      await router.push("/")

      return
    }

    throw new ResponseError(response)
  }
}

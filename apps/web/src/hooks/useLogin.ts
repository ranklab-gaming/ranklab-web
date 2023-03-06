import { ResponseError, UserType } from "@ranklab/api"
import { useRouter } from "next/router"

export function useLogin(userType: UserType) {
  const router = useRouter()

  return async (token: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const json = await response.json()
      router.push(json.location)
    }

    if (response.status === 400) {
      localStorage.setItem("loginSessionExpired", "true")
      router.push(`/login?user_type=${userType}`)
      return
    }

    throw new ResponseError(response)
  }
}

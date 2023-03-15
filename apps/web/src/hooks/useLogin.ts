import { ResponseError, UserType } from "@ranklab/api"
import { useRouter } from "next/router"

export function useLogin(userType: UserType) {
  const router = useRouter()

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
      await router.push(json.location)
      return
    }

    if (response.status === 400) {
      localStorage.setItem("loginSessionExpired", "true")

      await router.push({
        pathname: "/api/auth/signin",
        query: {
          user_type: userType,
        },
      })

      return
    }

    throw new ResponseError(response)
  }
}

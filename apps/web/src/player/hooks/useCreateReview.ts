import { createSessionReview } from "@/api"
import { SessionReview } from "@/session"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"

export function useCreateReview() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  return async function (review?: Partial<SessionReview>) {
    const response = await createSessionReview(review)

    if (response.ok) {
      const json = await response.json()
      await router.push(json.location)
      return
    }

    if (response.status === 401) {
      await router.push({
        pathname: "/api/auth/signin",
        query: {
          return_url: router.asPath,
        },
      })

      return
    }

    enqueueSnackbar(
      "There was a problem creating the review. Please try again later.",
      {
        variant: "error",
      }
    )
  }
}

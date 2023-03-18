import { defaultReview, setReview } from "@/utils/localStorage"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function () {
  const router = useRouter()

  useEffect(() => {
    setReview({
      ...defaultReview,
      coachId: (router.query.coach_id as string) ?? "",
    })

    router.push("/player/reviews/new/recording")
  }, [])

  return null
}

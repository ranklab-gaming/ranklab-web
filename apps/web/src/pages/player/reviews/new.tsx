import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { DashboardLayout } from "@/components/DashboardLayout"
import { defaultReview, useReview } from "@/hooks/useReview"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const getServerSideProps = withUserSsr("player", async function (ctx) {
  return {
    props: {},
  }
})

export default function ({ user }: PropsWithUser) {
  const router = useRouter()
  const [_, setReview] = useReview()

  useEffect(() => {
    setReview({
      ...defaultReview,
      coachId: (router.query.coach_id as string) ?? "",
    })

    router.push("/player/reviews/new/recording")
  }, [])

  return (
    <DashboardLayout user={user} showTitle={false} title="Request a Review" />
  )
}

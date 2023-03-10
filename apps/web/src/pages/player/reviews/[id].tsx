import { createServerApi } from "@/api/server"
import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsShowPage } from "@/components/PlayerReviewsShowPage"
import { Review } from "@ranklab/api"

interface Props {
  review: Review
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const id = ctx.query.id as string
  const api = await createServerApi(ctx)
  const review = await api.playerReviewsGet({ id })

  return {
    props: {
      review,
    },
  }
})

export default function ({ review, user }: PropsWithUser<Props>) {
  return <PlayerReviewsShowPage review={review} user={user} />
}

import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewCoachPage } from "@/components/PlayerReviewsNewCoachPage"
import { Coach } from "@ranklab/api"

interface Props {
  coaches: Coach[]
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx)
    const coaches = await api.playerCoachesList()

    return {
      props: {
        coaches,
      },
    }
  }
)

export default function ({ user, coaches }: PropsWithUser<Props>) {
  return <PlayerReviewsNewCoachPage user={user} coaches={coaches} />
}

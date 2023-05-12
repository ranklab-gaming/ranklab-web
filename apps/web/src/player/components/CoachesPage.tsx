import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Coach } from "@ranklab/api"
import { CoachList } from "./CoachList"

interface Props {
  coaches: Coach[]
}

export const PlayerCoachesPage = ({ coaches, user }: PropsWithUser<Props>) => {
  return (
    <DashboardLayout user={user} title="Coaches">
      {coaches.length > 0 ? <CoachList coaches={coaches} /> : null}
    </DashboardLayout>
  )
}

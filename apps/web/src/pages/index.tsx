import { LandingPage } from "@/components/LandingPage"
import { getParam } from "@/server/utils"
import { GetServerSideProps } from "next"

interface Props {
  error: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const error = getParam(ctx, "error")

  return {
    props: {
      error,
    },
  }
}

export default function ({ error }: Props) {
  return <LandingPage authError={error === "Authentication"} />
}

import { useParam } from "@ranklab/web/hooks/useParam"
import { GetServerSideProps } from "next"

interface Props {
  uid: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const uid = useParam(ctx, "uid")

  if (!uid) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      uid,
    },
  }
}

export default function OidcInteractionPage({ uid }: Props) {
  return (
    <form method="post" action={`/api/oidc/interactions/${uid}/finish`}>
      <button type="submit">Login</button>
    </form>
  )
}

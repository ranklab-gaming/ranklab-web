import { withOidcInteraction } from "@/oidc"
import { SignupPage } from "@/components/SignupPage"

interface Props {
  token: string | null
}

export const getServerSideProps = withOidcInteraction<Props>(async (ctx) => {
  const token = Array.isArray(ctx.query.token)
    ? ctx.query.token[0]
    : ctx.query.token

  return {
    props: {
      token: token ?? null,
    },
  }
})

export default function (props: Props) {
  return <SignupPage token={props.token ?? undefined} />
}

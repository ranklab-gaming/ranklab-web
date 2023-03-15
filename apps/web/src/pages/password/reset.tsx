import PasswordResetPage from "@/components/PasswordResetPage"
import { GetServerSideProps } from "next"

interface Props {
  token: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const token = ctx.query.token as string | undefined

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      token,
    },
  }
}

export default function ({ token }: Props) {
  return <PasswordResetPage token={token} />
}

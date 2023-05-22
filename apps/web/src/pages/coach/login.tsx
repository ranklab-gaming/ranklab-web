import { LoginPage } from "@/components/LoginPage"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { getOidcProvider, errors } = await import(
    "@ranklab/server/dist/oidc/provider"
  )

  const oidcProvider = await getOidcProvider()

  try {
    await oidcProvider.interactionDetails(ctx.req, ctx.res)
  } catch (e) {
    if (e instanceof errors.SessionNotFound) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    throw e
  }

  return {
    props: {},
  }
}

export default function () {
  return <LoginPage userType="coach" />
}

import { GetServerSideProps, GetServerSidePropsContext } from "next"

export const withOidcInteraction = <T extends { [key: string]: any } = {}>(
  getServerSideProps?: GetServerSideProps<T>
) => {
  return async (ctx: GetServerSidePropsContext) => {
    const { getOidcProvider, errors } = await import(
      "@ranklab/server/dist/oidc/provider"
    )

    const oidcProvider = await getOidcProvider()

    try {
      await oidcProvider.interactionDetails(ctx.req, ctx.res)
    } catch (e) {
      console.error(e)
      
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

    if (getServerSideProps) {
      return getServerSideProps(ctx)
    } else {
      return { props: {} }
    }
  }
}

import * as Sentry from "@sentry/nextjs"
import { NextPageContext } from "next"
import NextError, { ErrorProps } from "next/error"

const Error = (props: ErrorProps) => {
  return <NextError {...props} />
}

Error.getInitialProps = async (ctx: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(ctx)
  return NextError.getInitialProps(ctx)
}

export default Error

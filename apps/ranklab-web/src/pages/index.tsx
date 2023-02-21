import MainLayout from "@/layouts/main"
import { styled } from "@mui/material/styles"
import Page from "@/components/Page"
import {
  LandingHero,
  LandingFlow,
  LandingReview,
  LandingDashboard,
} from "@/components/landing"
import { GetServerSideProps } from "next"
import { getToken } from "next-auth/jwt"
import { useParam } from "../hooks/useParam"
import { useSnackbar } from "notistack"
import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

const RootStyle = styled(Page)({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

enum ErrorType {
  Login = "Login",
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Default = "Default",
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  const token = await getToken({ req: ctx.req })

  Sentry.captureException(new Error("test"))
  await Sentry.flush(2000)

  if (token) {
    const userType = token.sub!.split(":")[0]

    ctx.res
      .writeHead(302, {
        Location: `/${userType}/dashboard`,
      })
      .end()
  }

  const error = useParam(ctx, "error")

  return {
    props: {
      error,
    },
  }
}

export default function LandingPage({ error }: { error: string | null }) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error && Object.values(ErrorType).includes(error as ErrorType)) {
      enqueueSnackbar(
        "There was an error while authenticating, please try again later.",
        { variant: "error" }
      )
    }
  })

  return (
    <MainLayout>
      <RootStyle title="Be the better gamer | Ranklab" id="move_top">
        <LandingHero />
        <ContentStyle>
          <LandingFlow />
          <LandingReview />
          <LandingDashboard />
        </ContentStyle>
      </RootStyle>
    </MainLayout>
  )
}

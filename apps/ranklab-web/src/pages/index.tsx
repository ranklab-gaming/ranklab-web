import MainLayout from "@ranklab/web/src/layouts/main"
import { styled } from "@mui/material/styles"
import Page from "@ranklab/web/src/components/Page"
import {
  LandingHero,
  LandingFlow,
  LandingReview,
  LandingDashboard,
} from "@ranklab/web/src/components/landing"
import { GetServerSideProps } from "next"
import { getSession } from "@auth0/nextjs-auth0"
import jwt from "jsonwebtoken"

const RootStyle = styled(Page)({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  const session = getSession(ctx.req, ctx.res)

  if (session?.accessToken) {
    const claims = jwt.decode(session.accessToken, {
      json: true,
    })

    if (!claims) {
      throw new Error("Could not decode access token")
    }

    const userType = claims["https://ranklab.gg/user_type"]

    ctx.res
      .writeHead(302, {
        Location: `/${userType.toLowerCase()}/dashboard`,
      })
      .end()
  }

  return {
    props: {},
  }
}

export default function LandingPage() {
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

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
import { getToken } from "next-auth/jwt"

const RootStyle = styled(Page)({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  const token = await getToken({ req: ctx.req })

  if (token) {
    const userType = token.sub!.split(":")[0]

    ctx.res
      .writeHead(302, {
        Location: `/${userType}/dashboard`,
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

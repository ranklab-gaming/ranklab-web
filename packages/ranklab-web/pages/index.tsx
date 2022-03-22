// layouts
import MainLayout from "@ranklab/web/src/layouts/main"
// material
import { styled } from "@mui/material/styles"
// components
import Page from "@ranklab/web/src/components/Page"
import {
  LandingHero,
  LandingFlow,
  LandingDarkMode,
  LandingHugePackElements,
} from "@ranklab/web/src/components/landing"
import { GetServerSideProps } from "next"
import { getSession } from "@auth0/nextjs-auth0"

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

// ----------------------------------------------------------------------

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  const session = getSession(ctx.req, ctx.res)

  if (session) {
    ctx.res
      .writeHead(302, {
        Location: "dashboard",
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
          <LandingHugePackElements />
          <LandingDarkMode />
        </ContentStyle>
      </RootStyle>
    </MainLayout>
  )
}

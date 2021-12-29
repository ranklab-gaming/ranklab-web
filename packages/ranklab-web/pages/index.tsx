// @mui
import { styled } from "@mui/material/styles"
// layouts
import Layout from "src/layouts"
// components
import Page from "src/components/Page"
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeHugePackElements,
} from "sections/home"

// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
  height: "100%",
}))

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>
}

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Be the better gamer | Ranklab">
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <HomeMinimal />
          <HomeHugePackElements />
          <HomeDarkMode />
        </ContentStyle>
      </RootStyle>
    </Page>
  )
}

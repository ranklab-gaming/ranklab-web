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
import { useParam } from "../hooks/useParam"
import { useSnackbar } from "notistack"
import { useEffect } from "react"

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

  if (token) {
    const userType = token.sub!.split(":")[0]

    ctx.res
      .writeHead(302, {
        Location: `/${userType}/dashboard`,
      })
      .end()
  }

  const error = useParam(ctx, "error")
  const logout = useParam(ctx, "logout")

  return {
    props: {
      error,
      logout,
    },
  }
}

export default function LandingPage({
  error,
  logout,
}: {
  error: string | null
  logout: string | null
}) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error && Object.values(ErrorType).includes(error as ErrorType)) {
      if (logout) {
        enqueueSnackbar(
          "There was an error while authenticating, please try again later.",
          { variant: "error" }
        )
      } else {
        const form = document.createElement("form")
        form.method = "POST"
        form.action = "/api/auth/logout?error=Login"
        form.style.display = "none"
        document.body.appendChild(form)
        form.submit()
      }
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

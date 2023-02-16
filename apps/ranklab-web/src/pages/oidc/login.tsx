// @mui
import { Container } from "@mui/material"
import { UserType } from "@ranklab/api"
import { GetServerSideProps, NextPage } from "next"
import MinimalLayout from "@/layouts/minimal"
import { useState } from "react"
import SignUpForm from "@/components/SignUpForm"
import LoginForm from "@/components/LoginForm"

// ----------------------------------------------------------------------

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { oidcProvider } = await import("../api/oidc/[...path]")

  const interaction = await oidcProvider.interactionDetails(
    context.req,
    context.res
  )

  return {
    props: {
      userType: interaction.params.user_type,
    },
  }
}

const OidcLoginPage: NextPage<Props> = function ({ userType }) {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <MinimalLayout>
      <Container>
        {showSignUp ? (
          <SignUpForm setShowSignUp={setShowSignUp} />
        ) : (
          <LoginForm userType={userType} setShowSignUp={setShowSignUp} />
        )}
      </Container>
    </MinimalLayout>
  )
}

export default OidcLoginPage

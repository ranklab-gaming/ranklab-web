// @mui
import { Container } from "@mui/material"
import { UserType } from "@ranklab/api"
import { GetServerSideProps, NextPage } from "next"
import { oidcProvider } from "../api/oidc/[...path]"
import MinimalLayout from "@ranklab/web/layouts/minimal"
import { useState } from "react"
import SignUpForm from "@ranklab/web/components/SignUpForm"
import LoginForm from "@ranklab/web/components/LoginForm"

// ----------------------------------------------------------------------

interface Props {
  userType: UserType
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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

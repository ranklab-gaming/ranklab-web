import { LoginPage } from "@/components/LoginPage"
import { withOidcInteraction } from "@/oidc"

export const getServerSideProps = withOidcInteraction()

export default function () {
  return <LoginPage userType="coach" />
}

import { Container } from "@mui/material"
import { BasicLayout } from "@/components/BasicLayout"
import { LoginForm } from "@/components/LoginForm"

export default function () {
  return (
    <BasicLayout>
      <Container>
        <LoginForm userType="coach" />
      </Container>
    </BasicLayout>
  )
}

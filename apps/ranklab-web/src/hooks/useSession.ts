import { UserType } from "@ranklab/api"
import { decodeJwt } from "jose"
import { useSession as nextAuthUseSession } from "next-auth/react"

export interface Session {
  accessToken: string
  user: {
    id: string
    name: string
    email: string
    type: UserType
  }
}

export default function useSession(): Session {
  const { data: session } = nextAuthUseSession()

  if (!session) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  if (!session.user) {
    throw new Error("Expected user to be present in session")
  }

  const { email, name } = session.user

  if (!email || !name) {
    throw new Error("Expected user email and name to be present in user")
  }

  const jwt = decodeJwt(session.accessToken)

  if (!jwt.sub) {
    throw new Error("Expected sub to be present in JWT")
  }

  const userType = jwt.sub.split(":")[0]

  if (userType !== "coach" && userType !== "player") {
    throw new Error("Invalid user type in JWT")
  }

  return {
    ...session,
    user: {
      id: jwt.sub,
      email,
      name,
      type: userType,
    },
  }
}

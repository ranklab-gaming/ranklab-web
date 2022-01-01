import { handleAuth, handleLogin } from "@auth0/nextjs-auth0"
import type { GetLoginState } from "@auth0/nextjs-auth0/src/handlers/login"

const getLoginState: GetLoginState = (req, _loginOptions) => {
  return {
    user_type: req.query.userType,
  }
}

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, { getLoginState })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
})

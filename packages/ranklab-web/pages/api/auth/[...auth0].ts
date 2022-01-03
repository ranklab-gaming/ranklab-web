import { handleAuth, handleLogin, GetLoginState } from "@auth0/nextjs-auth0"

const getLoginState: GetLoginState = (req, _loginOptions) => {
  return {
    user_type: req.query.user_type,
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

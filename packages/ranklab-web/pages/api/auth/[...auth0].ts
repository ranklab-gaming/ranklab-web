import { handleAuth, handleLogin, GetLoginState } from "@auth0/nextjs-auth0"

const getLoginState: GetLoginState = (req, _loginOptions) => {
  const userType = Array.isArray(req.query.user_type)
    ? req.query.user_type[0]
    : req.query.user_type

  if (!["Coach", "Player"].includes(userType || "")) {
    throw {
      status: 400,
      message: "Invalid user type",
    }
  }

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

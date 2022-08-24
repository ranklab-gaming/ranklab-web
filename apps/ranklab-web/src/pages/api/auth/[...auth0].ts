import { handleAuth, handleLogin } from "@auth0/nextjs-auth0"

export default handleAuth({
  async login(req, res) {
    const userType = Array.isArray(req.query.user_type)
      ? req.query.user_type[0]
      : req.query.user_type

    if (!["Coach", "Player"].includes(userType || "")) {
      res.redirect(307, "/")
    }

    await handleLogin(req, res, {
      getLoginState() {
        return {
          user_type: req.query.user_type,
        }
      },
      returnTo: "/",
    })
  },
})

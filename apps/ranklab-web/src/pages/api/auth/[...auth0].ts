import { handleAuth, handleLogin } from "@auth0/nextjs-auth0"

export default handleAuth({
  async login(req, res) {
    const userType = Array.isArray(req.query.user_type)
      ? req.query.user_type[0]
      : req.query.user_type

    if (!["Coach", "Player"].includes(userType || "")) {
      res.redirect(307, "/")
    }

    const isCoach = userType === "Coach"

    await handleLogin(req, res, {
      authorizationParams: {
        scope: isCoach
          ? `${process.env.AUTH0_SCOPE} coach`
          : process.env.AUTH0_SCOPE,
      },
      returnTo: "/",
    })
  },
})

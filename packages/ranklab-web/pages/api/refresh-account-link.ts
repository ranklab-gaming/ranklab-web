import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import api from "src/api"

export default withApiAuthRequired(async function refreshAccountLink(req, res) {
  let accountLink = await api.server({ req, res }).coachAccountLinksCreate({
    refreshUrl: "http://ranklab-development:3000/api/refresh-account-link",
    returnUrl: "http://ranklab-development:3000/dashboard",
  })

  res.redirect(307, accountLink.url)
})

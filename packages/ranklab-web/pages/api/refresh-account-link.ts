import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import api from "src/api"

export default withApiAuthRequired(async function refreshAccountLink(req, res) {
  const host = req.headers.host
  const scheme = req.headers.origin?.match(/^https/) ? "https" : "http"

  let accountLink = await api.server({ req, res }).coachAccountLinksCreate({
    refreshUrl: `${scheme}://${host}/api/refresh-account-link`,
    returnUrl: `${scheme}://${host}/dashboard`,
  })

  res.redirect(307, accountLink.url)
})

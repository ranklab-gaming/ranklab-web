import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import api from "src/api"

export default withApiAuthRequired(async function refreshAccountLink(req, res) {
  let accountLink = await api.server({ req, res }).coachAccountLinksCreate()

  res.redirect(307, accountLink.url)
})

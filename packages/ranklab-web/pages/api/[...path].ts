import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import humps from "humps"

export default withApiAuthRequired(async function proxy(req, res) {
  try {
    const session = await getSession(req, res)
    const baseURL = process.env.API_HOST

    if (!baseURL) {
      throw new Error("Expected API_HOST to be present")
    }

    if (!req.query.path) {
      throw new Error("Expected path to be present in query")
    }

    if (!session) {
      throw new Error("Expected session to be present")
    }

    const response = await fetch(baseURL + req.query.path, {
      method: req.method,
      body: JSON.stringify(humps.decamelizeKeys(req.body)),
      headers: {
        Authorization: `Bearer ${session.idToken}`,
      },
    })

    const json = await response.json()
    res.status(response.status || 200).json(json)
  } catch (error: any) {
    console.error(error)

    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
})

import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"

export default withApiAuthRequired(async function proxy(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res)
    const baseURL = process.env.API_HOST

    if (!baseURL) {
      throw new Error("Expected API_HOST to be present")
    }

    if (!req.query.path) {
      throw new Error("Expected path to be present in query")
    }

    const response = await fetch(baseURL + req.query.path, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

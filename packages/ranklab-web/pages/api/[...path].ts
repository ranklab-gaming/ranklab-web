import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"

export default withApiAuthRequired(async function proxy(req, res) {
  try {
    const session = getSession(req, res)
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

    const fullPath = Array.isArray(req.query.path)
      ? req.query.path.join("/")
      : req.query.path

    const response = await fetch(`${baseURL}/${fullPath}`, {
      method: req.method,
      body: JSON.stringify(req.body),
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: req.headers.accept!,
        "Content-Type": req.headers["content-type"]!,
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

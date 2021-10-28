const encrypt = require("cypress-nextjs-auth0/encrypt")

module.exports = (on, config) => {
  on("task", { encrypt })

  config.env.auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET
  config.env.auth0CookieSecret = process.env.AUTH0_SECRET

  return config
}

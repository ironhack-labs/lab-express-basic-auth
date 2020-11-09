const session = require("express-session")

module.exports = app => {
  app.use(
    session({
      secret: "abcdefgh",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 }
    })
  )
}
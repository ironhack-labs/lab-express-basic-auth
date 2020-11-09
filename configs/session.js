const session = require("express-session")

module.exports = app => {
  app.use(
    session({
      secret: "secretpwd",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 }
    })
  )
}

const session     =     require('express-session')
const MongoStore  =     require('connect-mongo')(session)
const mongoose    =     require('mongoose')
// const sessionManagement = () => {
// }
// module.exports = sessionManagement
module.exports = app => {
  app.use(
    session({
      // secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      secret: "holamundo",
      cookie: {
        sameSite: 'none',
        httpOnly: true,
        // maxAge: 60000 // Tiempo máximo de la galleta
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  )
}

//aqui se conecta a la DB?
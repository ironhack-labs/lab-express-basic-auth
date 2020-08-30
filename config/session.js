const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const mongoose = require("mongoose")

// este archivo solo exporta una funcion que recibe nuestra instancia de express que funciona como nuestro server para configurar un middleware fuera del archivo principal

// session inyecta la propiedad req.session para que sea accesible en todo controller
module.exports = app => {
  app.use(
    session({
      secret: process.env.SECRET,
      // Este par de opciones son las que nos crean siempre una cookie nueva la primera vez que un user visita nuestro server o una vez que la anterior expira.(o sea manda una cookie si no existe de forma automatica).
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 60000 },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  )
}

const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  secret: process.env.SESSION_SECRET || "super-secret",
  resave: false, // no se vuelve a guardar si no hay cambios
  saveUninitialized: false, // no se guarda si no hay datos
  cookie: {
    secure: false, // solo se envía en HTTPS si es true
    httpOnly: true, // no permite acceso del JS del frontend a la cookie
    maxAge: 24 * 3600 * 1000 * MAX_AGE, // caduca en 7 días
  },
  store: new MongoStore({// guarda la sesión en la BBDD
    mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-express-basic-auth", // la URL de la BBDD
    ttl: 24 * 3600 * 1000 * MAX_AGE // tiempo de vida de la sesión en segundos (7 días)
  })
});

module.exports.currentUser = (req, res, next) => {
  const userId = req.session.userId;
 
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.currentUser = user; // para tener acceso al usuario en los controladores
        res.locals.currentUser = user; // res.locals es un objeto que se pasa a las vistas
        next(); // para que pase a la siguiente función
      })
      .catch((error) => next(error));
  } else {
    next();
  }
};

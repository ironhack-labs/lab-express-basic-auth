const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  secret: process.env.SESS_SECRET, // esto lo guardaamos en el dot.env COOKIE_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // mandamos la cookie en protocolos HTTP/HTTPS si es true solo HTTPS
    httpOnly: true, // no es accesible por el Javascript del client-browser
    maxAge: 24 * 3600 * 1000 * MAX_AGE, // una semana de vida
  },
  store: new MongoStore({
    mongoUrl: mongoose.connection._connectionString, //monngoose.connection.db
    ttl: 24 * 3600 * MAX_AGE,
  }),
});

module.exports.loggedUser = (req, res, next) => {
  const userId = req.session.userId;

  if (userId) {
    User.findById(userId)
      .then((user) => {
        if (user) {
          req.currentUser = user; // todos los middlewares ya tienen acceso a currentUser
          res.locals.currentUser = user; // res.locals es el objeto donde se manda informacion a todas las vistas (hbs)
          next();
        } else {
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    next();
  }
};

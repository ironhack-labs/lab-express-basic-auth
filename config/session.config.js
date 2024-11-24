const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  name: "express-cookie",
  secret: "super-secret", 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge: 24 * 3600 * 1000 * MAX_AGE, 
  },
  store: new MongoStore({
    mongoUrl: mongoose.connection._connectionString, 
    ttl: 24 * 3600 * MAX_AGE,
  }),
});

module.exports.loggedUser = (req, res, next) => {
  const userId = req.session.userId;

  if (userId) {
    User.findById(userId)
      .then((userFromDB) => {
        if (userFromDB) {
          req.currentUser = userFromDB; // todos los middlewares ya tienen acceso a currentUser
          res.locals.currentUser = userFromDB; // res.locals es el objeto donde se manda informacion a todas las vistas (hbs)
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
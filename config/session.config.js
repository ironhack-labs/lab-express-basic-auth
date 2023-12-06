const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  secret: process.env.COOKIE_SECRET || "super-secret",
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
const expressSession = require("express-session");
const connectMongo = require("connect-mongo")
const mongoose = require("mongoose");

const MongoStore = connectMongo(expressSession)

const session = expressSession({
  secret: process.env.SESSION_SECRET || "Nihao, My Concubine",
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE || false,
    httpOnly: true,
    maxAge: process.env.SESSION_MAX_AGE || 3600000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: process.env.SESSION_MAX_AGE || 3600,
  }),
  resave: true
});

module.exports = session

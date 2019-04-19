const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const mongoose     = require('mongoose');
const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS)

module.exports = session({
  secret: process.env.SESSION_SECRET || 'Super Secret', 
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECRET || false,
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: SESSION_MAX_AGE_SECONDS
  })
});
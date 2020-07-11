const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const mongoose = require('mongoose')

const SESSION_MAX_AGE_SECONDS =
  Number(process.env.SESSION_MAX_AGE_SECONDS) || 60 * 60 * 24 * 7

const mongoStore = connectMongo(expressSession)

const session = expressSession({
  secret: process.env.SESSION_SECRET || 'super secret (change it)',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE || false,
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS * 1000
  },
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    ttl: SESSION_MAX_AGE_SECONDS
  })
})

module.exports = session

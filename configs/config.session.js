const connect = require('connect-mongo')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')

const mongoStore = connectMongo(expressSession)

const session = expressSession( {
    secret: process.env.SESSION_SECRET || "super secret (change it)",
    saveUninitialized: true,
    cookie: {
        secure:  process.env.SESSION_SECURE || false,
        httpOnly: true,
        maxAge: process.env.SESSION_MAX_AGE || 9000000, 
    }, 
    store: new mongoStore({
        mongooseConnection: mongoose.connection,
        ttl: process.env.SESSION_MAX_AGE || 9000,
    })
})

module.exports = session
const expressSession = require('express-session')
const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')

const MongoStore = connectMongo(expressSession)

const session = expressSession({
    secret: process.env.SESSION_SECRET || 'SECRET' ,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: process.env.SESSION_SECURE || false,
        httpOnly: true,
        maxAge: process.env.SESSION_MAX_AGE || 3600000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: process.env.SESSION_MAX_AGE || 3600000
    })
})

module.exports = session
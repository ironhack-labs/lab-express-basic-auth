const expressSession = require('express-session')
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');

const MongoStore = connectMongo(expressSession);

const session = expressSession({
    secret: process.env.SESS_SECRET || 'super session secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: process.env.SESS_SECURE || false,
        httpOnly: true,
        maxAge: process.env.SESS_MAX_AGE || 3600000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: process.env.SESS_MAX_AGE || 3600000,
    })
})

module.exports = session
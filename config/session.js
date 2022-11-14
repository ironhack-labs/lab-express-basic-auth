const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')

module.exports = (app) => {
    app.set('trust proxy', 1)

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUninitialized: false,
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 60 * 100000,
            },
            store: MongoStore.signup({
                mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth_oct22',
                ttl: 60 * 60 * 24
            }),
        })
    )
}
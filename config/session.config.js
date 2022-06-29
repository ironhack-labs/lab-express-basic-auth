const session = require('express-session')
const mongoStore = require('connect-mongo')
const mongoose = require('mongoose')

module.exports = app => {
    app.set('trust proxy',1);

    app.use(
        session({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: false,
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 60000
            },
            store: mongoStore.create({
                mongoUrl: process.env.MONGO_URI || "mongodb://localhost/lab-express-basic-auth"
            })
        })
    )
} 
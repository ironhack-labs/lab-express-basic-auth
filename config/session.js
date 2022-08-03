const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

module.exports = (app) => {
    app.set('trust proxy', 1);

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUninitialized: falsed,
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
            },
            store: MongoStore.create({
                MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";
                ttl: 60 * 60 * 24
            })
        })
    )
};
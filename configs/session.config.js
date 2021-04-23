const session = require('express-session');

const MongoStore = require('connect-mongo');

module.exports = (app) => {
    app.use(session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 120000,
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        })
    }))

}

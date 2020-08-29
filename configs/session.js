const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
    app.use(session({
        secret: process.env.SECRET,
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 120000
        },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 60 * 60
        })
    }))
}
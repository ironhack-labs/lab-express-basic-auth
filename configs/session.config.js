const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 8.64e+7
            },
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60 * 60 * 24 // 1 day
            })
        })
    );
};
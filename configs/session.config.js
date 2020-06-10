const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 60 * 1000},
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60*60*24
            })
        })
    )
}
const session = require('express-session');
const mongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60000 },
            store: new mongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60 * 60 * 24
            })
        })
    );
};
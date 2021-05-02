const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            name: 'appCookie',
            resave: true,
            saveUninitialized: false,
            cookie: {
                // sameSite: 'none',
                httpOnly: true,
                maxAge: 60000
            }
        })
    );
};
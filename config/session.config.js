const expressSession = require('express-session');
const MongoStore = require('connect-mongo');

const mongoose = require('mongoose')
const User = require('../models/User.model')

const sessionMaxAge = process.env.SESSION_AGE || 7;

module.exports.sessionConfig = expressSession({
    secret: process.env.COOKIE_SECRET || 'Super secret (change it!)',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 3600 * 1000 * sessionMaxAge,
        httpOnly: true
    },
    store: new MongoStore({
        mongoUrl: mongoose.connection._connectionString,
        ttl: 24 * 3600 * sessionMaxAge
    })
});

module.exports.loadUser = (req, res, next) => {
    const userId = req.session.userId;

    if(userId) {
        User.findById(userId)
            .then(user => {
                res.locals.currentUser = user;
                req.user = user;
                next();
            })
            .catch(err => next(err))
    } else {
        next()
    }
};
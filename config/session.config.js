const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
    secret: process.env.COOKIE_SECRET || "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 24 * 3600 * 1000 * MAX_AGE, 
    },
    store: new MongoStore({
        mongoUrl: mongoose.connection._connectionString, 
        ttl: 24 * 3600 * MAX_AGE,
    }),
});
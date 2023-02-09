const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const passport = require('passport');
const bindUser = require('../middleware/bind-user');

module.exports = (app) => {
    // config needed for when the app is deployed 
    app.set('trust porxy', 1)

    app.use(session({
        // secret : every session needs a secret in order to relate to the cookie.
        // secre can be wathever string we want 
        secret: process.env.SESSION_SECRET,
        // to store it back in mongo DB
        resave: true,

        saveUnitialized: false,
        cookie: {
            // configurations will be different if its deployed or not
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            // if the user doenst do this nothing with the site during 60000 time 
            maxAge: 60000
        },
        // rolling resets everytime the maxAg
        rolling: true,
        store: MongoStore.create(
            {
                mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/library-project"
            }
        )
    }))

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bindUser); // THE USER IS ALLWAS ACCESSED 
}
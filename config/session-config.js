//require session
const session = require('express-session');
//require mongoStore
const MongoStore = require('connect-mongo');
//require mongoose
const mongoose = require('mongoose');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = apps => {
    // <== app is just a placeholder here
    // but will become a real "app" in the app.js
    // when this file gets imported/required there

    // use session
    apps.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60000 },  // 60 * 1000 ms === 1 min
            store: MongoStore.create({
                mongoUrl: 'mongodb://localhost/lab-express-basic-auth',
                // ttl => time to live
                ttl: 60 * 60 * 24
                // 60sec * 60min * 24h => 1 day
            }),
        })
    );
}
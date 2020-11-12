// configs/session.config.js

// require session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
        store: new MongoStore({
          // <== ADDED !!!
          mongooseConnection: mongoose.connection,
          // ttl => time to live
          ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
      })
    );
  };

// configs/session.config.js

// require session
const session = require('express-session');

// ADDED: require mongostore
const MongoStore = require('connect-mongo')(session);

// ADDED: require mongoose
const mongoose = require('mongoose');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
  //              |
  //              app is just a placeholder here but will become a real "app"
  //              in the app.js when this file gets imported/required there

  // use session
  app.use(
    session({
      // in the network tab, we will be able to see the cookie - this secret is getting hashed inside that cookie
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60000 // 60 * 1000 ms === 1 min
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // ttl => time to live
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
};

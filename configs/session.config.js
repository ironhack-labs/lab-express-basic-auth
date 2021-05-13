// configs/session.config.js

// require session
const session = require('express-session');

// ADDED: require mongostore
const MongoDbStore = require('connect-mongo');
 
// ADDED: require mongoose
const mongoose = require('mongoose');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: true,
        httpOnly: true,
        maxAge: 600000 // 600 * 1000 ms === 10 min
      },
    //   store: new MongoStore({
    //     // <== ADDED !!!
    //     mongooseConnection: mongoose.connection,
    //     // ttl => time to live
    //     ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    //   })
        store: MongoDbStore.create({
        mongoUrl: process.env.MONGODB_URL
        })
    })
  );
};

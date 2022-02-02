
// Declare modules including express session and connect-mongo
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
          secret: process.env.SESS_SECRET,
          resave: true,
          saveUninitialized: false,
          cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60000 // 60 * 1000 ms === 1 min
          }, // ADDED code below to store the session
          store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth'
     
            // ttl => time to live
            // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
          })
        })
      );
    };
    
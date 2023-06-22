const MongoStore = require('connect-mongo');

const mongoose = require('mongoose');

const session = require('express-session');

module.exports = app => {
    // <== app is just a placeholder here
    // but will become a real "app" in the app.js
    // when this file gets imported/required there
  
    // required for the app when deployed to Heroku (in production)
    app.set('trust proxy', 1);
  
    const MONGO_URI = require('../utils/constants')
    // use session
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: true,       //don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        cookie: {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 600000
        }, // ADDED code below !!!
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          // ttl => time to live
          // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
      })
    );
  };
  
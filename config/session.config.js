const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.SESSION_SECRET, //kinda like a hash to protect our cookie
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.NODE_ENV === 'production',
        httpOnly: true,
        //maxAge: 1000 * 60 * 60 * 24 * 14,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/basic_auth',
        //time to live
        ttl: 60 * 60 * 24 * 14, //expiration date for the session, this is in seconds so 60 = 1minute * 60 = 1h * 24= 1 day * 14= 2 weeks, it counts since we loggin
      }),
    })
  );
};
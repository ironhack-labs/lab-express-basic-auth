const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
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
        ttl: 60 * 60 * 24 * 14,
      }),
    })
  );
};

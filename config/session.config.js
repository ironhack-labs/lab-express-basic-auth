const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        //maxAge: 6000
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth',
        ttl: 60 * 60 * 24 * 14,
      }),
    })
  );
};

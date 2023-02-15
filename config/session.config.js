const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = (app) => {
    //for deployment
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
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab-express-basic-auth', /* -> this lab-express-basic-auth is our folder. could be recipes like the lab */
        //time to live  -> this one tells us that after X amount of time, it will kill the session and log out.
        ttl: 60 * 60 * 24 * 14,
        // 60sec 60sec 24hours 2weeks -> to give us how many seconds in 2 weeks (in this case).
      }),
    })
  );
};
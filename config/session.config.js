const session = require('express-session');
const MonoStore = require('connect-mongo');
// const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
  app.set('trust proxy', 1); // trust first proxy
  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: false,
      httpOnly: true,
      cookie: {
        //   secure: true,
        sameSite: 'lax',
        maxAge: 60 * 1000,
        httpOnly: true,
      },
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/lab-express-basic-auth',
        ttl: 60,
      }),
    })
  );
};

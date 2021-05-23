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
        sameSite: true,
        httpOnly: true,
        maxAge: 60000 
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24
      })
    })
  );
};
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

module.exports = incomingApp => {
  incomingApp.use(
    session({
      secret: process.env.SESS_SECRET,
      name: "appCookie",
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 100000
      },
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/express-basic-auth-dev',
        ttl: 60 * 60 * 24
      })
    }));
};